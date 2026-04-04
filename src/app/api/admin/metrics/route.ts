import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // 1. Get total students count via HTTPS
    const { count: totalStudents } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student');

    // 2. Get total applications count via HTTPS
    const { count: totalApplications } = await supabase
      .from('JobApplication')
      .select('*', { count: 'exact', head: true });

    // 3. Get shortlisted/interviewing students count via HTTPS
    const { count: shortlistedStudents } = await supabase
      .from('JobApplication')
      .select('*', { count: 'exact', head: true })
      .in('status', ['shortlisted', 'hired', 'interviewing']);

    // 4. Get total unique companies via HTTPS
    const { data: companies } = await supabase
      .from('Company')
      .select('id')
      .eq('status', 'active');

    return NextResponse.json({
      metrics: {
        totalStudents: totalStudents || 0,
        totalCompanies: companies?.length || 0,
        totalApplications: totalApplications || 0,
        shortlistedStudents: shortlistedStudents || 0
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Fetch admin metrics error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch cloud metrics over HTTPS' }, { status: 500 });
  }
}
