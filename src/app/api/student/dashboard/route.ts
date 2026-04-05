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
    // 1. Fetch profile first as we need its ID for application counts
    const { data: profile, error: profileError } = await supabase
      .from('StudentProfile')
      .select('id, fullName, applications:JobApplication(count)')
      .eq('userId', userId)
      .single();

    if (profileError && profileError.code !== 'PGRST116') throw profileError;

    // 2. Fetch all other data concurrently
    const [shortlisted, pending, activeJobs, latestJobsResult, notificationsResult] = await Promise.all([
      // Count shortlisted
      supabase.from('JobApplication').select('id', { count: 'exact', head: true }).eq('studentId', profile?.id).eq('status', 'shortlisted'),
      // Count pending
      supabase.from('JobApplication').select('id', { count: 'exact', head: true }).eq('studentId', profile?.id).eq('status', 'pending'),
      // Count all active jobs
      supabase.from('JobListing').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      // Fetch top 3 latest jobs
      supabase.from('JobListing')
        .select('id, role, salaryCtc, createdAt, company:Company(name)')
        .eq('status', 'active')
        .order('createdAt', { ascending: false })
        .limit(3),
      // Fetch top 5 notifications
      supabase.from('Notification')
        .select('id, message, createdAt')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
        .limit(5)
    ]);

    return NextResponse.json({
      stats: {
        activeJobs: activeJobs.count || 0,
        applications: profile?.applications?.[0]?.count || 0,
        shortlisted: shortlisted.count || 0,
        pending: pending.count || 0,
      },
      profileName: profile?.fullName?.split(' ')[0] || 'Student',
      notifications: notificationsResult.data || [],
      latestJobs: latestJobsResult.data || []
    }, { status: 200 });

  } catch (error: any) {
    console.error('Dashboard logic error:', error.message);
    return NextResponse.json({ error: 'Failed to load dashboard over HTTPS' }, { status: 500 });
  }
}
