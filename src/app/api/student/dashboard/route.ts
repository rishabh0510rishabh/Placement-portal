import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  try {
    // 1. Get student profile via HTTPS (Bypasses all port blocks)
    const { data: profile, error: profileError } = await supabase
      .from('StudentProfile')
      .select('*, applications:JobApplication(count)')
      .eq('userId', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') throw profileError;

    // 2. Get specific status counts
    const { count: shortlistedCount } = await supabase
      .from('JobApplication')
      .select('*', { count: 'exact', head: true })
      .eq('studentId', profile?.id)
      .eq('status', 'shortlisted');

    const { count: pendingCount } = await supabase
      .from('JobApplication')
      .select('*', { count: 'exact', head: true })
      .eq('studentId', profile?.id)
      .eq('status', 'pending');

    const { count: activeJobsCount } = await supabase
      .from('JobListing')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // 3. Fetch latest jobs
    const { data: latestJobs } = await supabase
      .from('JobListing')
      .select('*, company:Company(*)')
      .eq('status', 'active')
      .order('createdAt', { ascending: false })
      .limit(3);

    // 4. Fetch notifications
    const { data: notifications } = await supabase
      .from('Notification')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        activeJobs: activeJobsCount || 0,
        applications: profile?.applications?.[0]?.count || 0,
        shortlisted: shortlistedCount || 0,
        pending: pendingCount || 0,
      },
      profileName: profile?.fullName?.split(' ')[0] || 'Student',
      notifications: notifications || [],
      latestJobs: latestJobs || []
    }, { status: 200 });

  } catch (error: any) {
    console.error('Dashboard logic error:', error.message);
    return NextResponse.json({ error: 'Failed to load dashboard over HTTPS' }, { status: 500 });
  }
}
