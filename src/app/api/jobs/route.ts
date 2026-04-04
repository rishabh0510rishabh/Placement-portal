import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';
import { Branch } from '@/types/database';

export const dynamic = 'force-dynamic';

// GET /api/jobs - Fetch active job listings via HTTPS
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let query = supabase
      .from('JobListing')
      .select('*, company:Company(name, industry)')
      .order('createdAt', { ascending: false });

    // For students, fetch active jobs only.
    if ((session.user as any).role !== 'admin') {
      query = query.eq('status', 'active');
    }

    const { data: jobs, error } = await query;
    if (error) throw error;

    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch jobs error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch jobs over HTTPS' }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job listing (Admin Only) via HTTPS
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const body = await req.json();

    // Basic validation
    const requiredFields = [
      'companyId', 'role', 'description', 
      'minimumCgpa', 'allowedBranches', 'maximumBacklogs', 
      'salaryCtc', 'location', 'deadline'
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json({ error: `Field '${field}' is required.` }, { status: 400 });
      }
    }

    // Map branches to enum safely
    const safeBranches: Branch[] = (body.allowedBranches as string[]).map(b => b.replace('-', '_') as Branch);

    // 1. Create the job listing over HTTPS
    const { data: newJob, error: jobError } = await supabase
      .from('JobListing')
      .insert({
        ...body,
        allowedBranches: safeBranches,
        deadline: new Date(body.deadline).toISOString(),
      })
      .select('*, company:Company(*)')
      .single();

    if (jobError) throw jobError;

    // 2. Notify all students efficiently over HTTPS
    try {
      const { data: students } = await supabase
        .from('User')
        .select('id')
        .eq('role', 'student');

      if (students && students.length > 0) {
        const notifications = students.map((student) => ({
          userId: student.id,
          title: 'New Job Posting!',
          message: `${newJob.company.name} is hiring for ${newJob.role}! Check eligibility and apply now.`,
          type: 'job_alert',
          link: `/student/jobs/${newJob.id}`,
        }));

        await supabase.from('Notification').insert(notifications);
      }
    } catch (notifError) {
      console.error('Failed to create broadcast notifications for new job over HTTPS:', notifError);
    }

    return NextResponse.json({ message: 'Job listing created over HTTPS successfully', job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error('Job creation error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error over HTTPS' }, { status: 500 });
  }
}
