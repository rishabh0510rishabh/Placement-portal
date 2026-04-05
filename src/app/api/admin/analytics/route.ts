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
    // 1. Fetch Branch-wise Stats
    // We need total students per branch and hired students per branch
    const { data: students } = await supabase
      .from('StudentProfile')
      .select('branch, id');

    const { data: placements } = await supabase
      .from('JobApplication')
      .select('status, student:StudentProfile(branch)')
      .eq('status', 'hired');

    const branchStatsMap: Record<string, { total: number; placed: number }> = {};

    students?.forEach(s => {
      if (!branchStatsMap[s.branch]) branchStatsMap[s.branch] = { total: 0, placed: 0 };
      branchStatsMap[s.branch].total++;
    });

    placements?.forEach((p: any) => {
      const branch = p.student?.branch;
      if (branch && branchStatsMap[branch]) {
        branchStatsMap[branch].placed++;
      }
    });

    const branchStats = Object.entries(branchStatsMap).map(([branch, stats]) => ({
      branch,
      students: stats.total,
      placed: stats.placed,
      percentage: stats.total > 0 ? Math.round((stats.placed / stats.total) * 100) : 0
    })).sort((a, b) => b.percentage - a.percentage);

    // 2. Fetch Monthly Trends (Last 6 months)
    const { data: applications } = await supabase
      .from('JobApplication')
      .select('appliedAt, status');

    const monthlyDataMap: Record<string, { applications: number; shortlisted: number; selected: number }> = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    applications?.forEach(app => {
      const date = new Date(app.appliedAt);
      const monthLabel = months[date.getMonth()];
      if (!monthlyDataMap[monthLabel]) {
        monthlyDataMap[monthLabel] = { applications: 0, shortlisted: 0, selected: 0 };
      }
      monthlyDataMap[monthLabel].applications++;
      if (app.status === 'shortlisted' || app.status === 'interviewing' || app.status === 'hired') {
        monthlyDataMap[monthLabel].shortlisted++;
      }
      if (app.status === 'hired') {
        monthlyDataMap[monthLabel].selected++;
      }
    });

    // Sort monthly data by current year's months
    const monthlyData = Object.entries(monthlyDataMap)
      .map(([month, stats]) => ({ month, ...stats }))
      .sort((a, b) => months.indexOf(a.month) - months.indexOf(b.month));

    // 3. Top Recruiters
    const { data: hiredApps } = await supabase
      .from('JobApplication')
      .select(`
        status,
        job:JobListing(
          salaryCtc,
          company:Company(name)
        )
      `)
      .eq('status', 'hired');

    const recruiterMap: Record<string, { hired: number; totalCTC: number; count: number }> = {};

    hiredApps?.forEach((app: any) => {
      const companyName = app.job?.company?.name || 'Unknown';
      const ctcRaw = app.job?.salaryCtc || '0';
      const ctc = parseFloat(ctcRaw.replace(/[^0-9.]/g, '')) || 0;

      if (!recruiterMap[companyName]) {
        recruiterMap[companyName] = { hired: 0, totalCTC: 0, count: 0 };
      }
      recruiterMap[companyName].hired++;
      recruiterMap[companyName].totalCTC += ctc;
      recruiterMap[companyName].count++;
    });

    const topRecruiters = Object.entries(recruiterMap)
      .map(([company, stats]) => ({
        company,
        hired: stats.hired,
        avgCTC: stats.count > 0 ? (stats.totalCTC / stats.count).toFixed(2) + ' LPA' : '0 LPA'
      }))
      .sort((a, b) => b.hired - a.hired)
      .slice(0, 5);

    // 4. Summary Stats
    const { count: totalCos } = await supabase.from('Company').select('*', { count: 'exact', head: true });

    return NextResponse.json({
      branchStats,
      monthlyData,
      topRecruiters,
      totalCompanies: totalCos || 0
    }, { status: 200 });

  } catch (error: any) {
    console.error('Analytics error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch analytics data' }, { status: 500 });
  }
}
