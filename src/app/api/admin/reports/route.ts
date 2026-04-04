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

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    let csvContent = "";
    let filename = "report.csv";

    if (type === 'students') {
      filename = "all_students_report.csv";
      
      // Fetch all students with their profiles via HTTPS
      const { data: students, error } = await supabase
        .from('User')
        .select(`
          name, 
          email, 
          profile:StudentProfile(*)
        `)
        .eq('role', 'student');

      if (error) throw error;

      const headers = ["Name", "Email", "Roll Number", "Branch", "Section", "CGPA", "Placed Status"];
      csvContent = [
        headers.join(','),
        ...(students || []).map(s => {
          const profile = (s as any).profile?.[0] || {};
          return [
            `"${s.name}"`,
            `"${s.email}"`,
            `"${profile.rollNumber || '-'}"`,
            `"${profile.branch || '-'}"`,
            `"${profile.section || '-'}"`,
            `"${profile.academicDetails?.cgpa || '0'}"`,
            `"${profile.isPlaced ? 'Placed' : 'Unplaced'}"`
          ].join(',');
        })
      ].join('\n');

    } else if (type === 'applications') {
      const jobId = searchParams.get('jobId');
      filename = "job_applications_report.csv";

      let query = supabase
        .from('JobApplication')
        .select(`
          status,
          appliedAt,
          student:StudentProfile(fullName, email),
          job:JobListing(role, company:Company(name))
        `);

      if (jobId) {
        query = query.eq('jobId', jobId);
      }

      const { data: applications, error } = await query;
      if (error) throw error;

      const headers = ["Student Name", "Email", "Company", "Job Role", "Application Status", "Applied Date"];
      csvContent = [
        headers.join(','),
        ...(applications || []).map((app: any) => [
          `"${app.student?.fullName || 'Unknown'}"`,
          `"${app.student?.email || 'Unknown'}"`,
          `"${app.job?.company?.name || 'Unknown'}"`,
          `"${app.job?.role || 'Unknown'}"`,
          `"${app.status}"`,
          `"${new Date(app.appliedAt).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

    } else if (type === 'placed') {
      filename = "placed_students_report.csv";
      
      const { data: placed, error } = await supabase
        .from('JobApplication')
        .select(`
          appliedAt,
          student:StudentProfile(fullName, email),
          job:JobListing(role, company:Company(name))
        `)
        .eq('status', 'hired');

      if (error) throw error;

      const headers = ["Student Name", "Email", "Company", "Job Role", "Hired Date"];
      csvContent = [
        headers.join(','),
        ...(placed || []).map((app: any) => [
          `"${app.student?.fullName || 'Unknown'}"`,
          `"${app.student?.email || 'Unknown'}"`,
          `"${app.job?.company?.name || 'Unknown'}"`,
          `"${app.job?.role || 'Unknown'}"`,
          `"${new Date(app.appliedAt).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

    } else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    console.error('Reports generation error:', error.message);
    return NextResponse.json({ error: 'Failed to generate cloud report over HTTPS' }, { status: 500 });
  }
}
