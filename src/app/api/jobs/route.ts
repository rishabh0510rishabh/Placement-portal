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
    const safeBranches: string[] = (body.allowedBranches as string[]).map(b => b.replace('_', '-'));

    // 1. Create the job listing over HTTPS
    const now = new Date();
    const deadlineDate = new Date(body.deadline);
    if (deadlineDate < now) {
      return NextResponse.json({ error: "Job application deadline cannot be in the past." }, { status: 400 });
    }

    const nowISO = now.toISOString();
    const { data: newJob, error: jobError } = await supabase
      .from('JobListing')
      .insert({
        id: crypto.randomUUID(),
        companyId: body.companyId,
        role: body.role,
        category: body.category || 'Full Time',
        description: body.description,
        minimumCgpa: body.minimumCgpa,
        maximumBacklogs: body.maximumBacklogs,
        salaryCtc: body.salaryCtc,
        location: body.location,
        status: 'active',
        allowedBranches: safeBranches,
        deadline: deadlineDate.toISOString(),
        requiredSkills: body.requiredSkills || [],
        createdAt: nowISO,
        updatedAt: nowISO,
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
          id: crypto.randomUUID(),
          userId: student.id,
          title: 'New Job Posting!',
          message: `${newJob.company.name} is hiring for ${newJob.role}! Check eligibility criteria and apply now.`,
          type: 'job_alert',
          link: `/student/jobs/${newJob.id}`,
          createdAt: nowISO,
          updatedAt: nowISO,
        }));

        await supabase.from('Notification').insert(notifications);
      }
    } catch (notifError) {
      console.error('Failed to create job notifications for new job over HTTPS:', notifError);
    }

    return NextResponse.json({ message: 'Job listing created over HTTPS successfully', job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error('Job creation error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error over HTTPS' }, { status: 500 });
  }
}

// PATCH /api/jobs - Update an existing job (Admin Only)
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const body = await req.json();

    // Date validation: Deadline must be in the future if provided
    if (body.deadline) {
      const deadlineDate = new Date(body.deadline);
      const now = new Date();
      if (deadlineDate < now) {
        return NextResponse.json({ error: "Modified job deadline cannot be set in the past." }, { status: 400 });
      }
    }

    const safeBranches: string[] = (body.allowedBranches as string[]).map(b => b.replace('_', '-'));
    
    const { data: updatedJob, error } = await supabase
      .from('JobListing')
      .update({
        companyId: body.companyId,
        role: body.role,
        category: body.category,
        description: body.description,
        minimumCgpa: body.minimumCgpa,
        maximumBacklogs: body.maximumBacklogs,
        salaryCtc: body.salaryCtc,
        location: body.location,
        allowedBranches: safeBranches,
        deadline: new Date(body.deadline).toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ job: updatedJob }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/jobs - Delete a job listing (Admin Only) via HTTPS
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  try {
    const { error } = await supabase
      .from('JobListing')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return NextResponse.json({ message: 'Job listing deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete job error:', error.message);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
