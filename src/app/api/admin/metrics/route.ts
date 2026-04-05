import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch counts for the stats grid
    const [
      { count: totalStudents },
      { count: totalCompanies },
      { count: totalJobs },
      { count: totalApplications }
    ] = await Promise.all([
      supabase.from('User').select('id', { count: 'exact', head: true }).eq('role', 'student'),
      supabase.from('Company').select('id', { count: 'exact', head: true }),
      supabase.from('JobListing').select('id', { count: 'exact', head: true }),
      supabase.from('JobApplication').select('id', { count: 'exact', head: true })
    ]);

    // Fetch recent applications
    const { data: recentApplications } = await supabase
      .from('JobApplication')
      .select(`
        id,
        status,
        appliedAt,
        user:User(fullName, email),
        job:JobListing(role, company:Company(name))
      `)
      .order('appliedAt', { ascending: false })
      .limit(5);

    // Fetch companies by application count (Only needed fields)
    const { data: topCompaniesRaw } = await supabase
      .from('JobListing')
      .select(`
        id,
        company:Company(name),
        applications:JobApplication(count)
      `);

    // Grouping logic for top companies
    const companyStats: { [key: string]: { name: string; applications: number } } = {};
    topCompaniesRaw?.forEach((item: any) => {
      const name = item.company?.name || 'Unknown';
      if (!companyStats[name]) {
        companyStats[name] = { name, applications: 0 };
      }
      companyStats[name].applications += item.applications?.[0]?.count || 0;
    });

    const topCompanies = Object.values(companyStats)
      .sort((a, b) => b.applications - a.applications)
      .slice(0, 5);

    return NextResponse.json({
      stats: {
        totalStudents: totalStudents || 0,
        totalCompanies: totalCompanies || 0,
        totalJobs: totalJobs || 0,
        totalApplications: totalApplications || 0
      },
      recentApplications: recentApplications || [],
      topCompanies
    }, { status: 200 });
  } catch (error: any) {
    console.error('Metrics fetch error:', error.message);
    return NextResponse.json({ error: 'Failed to aggregate system telemetry' }, { status: 500 });
  }
}
