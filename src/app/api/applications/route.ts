import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// POST /api/applications - Submit a new job application via HTTPS
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    const body = await req.json();
    const { jobId, resumeUrl } = body;

    if (!jobId || !resumeUrl) {
      return NextResponse.json({ error: 'Job ID and Resume URL are required.' }, { status: 400 });
    }

    // 1. Verify job exists and is active over HTTPS
    const { data: job, error: jobFetchError } = await supabase
      .from('JobListing')
      .select('status, company:Company(name)')
      .eq('id', jobId)
      .single();

    if (jobFetchError || !job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }
    
    if (job.status !== 'active') {
      return NextResponse.json({ error: 'This job is no longer accepting applications.' }, { status: 400 });
    }

    // 1. Get student profile ID first
    const { data: profile } = await supabase
      .from('StudentProfile')
      .select('id')
      .eq('userId', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Student profile not found. Please complete profile first.' }, { status: 404 });
    }

    // 2. Submit application via HTTPS
    const now = new Date().toISOString();
    const { data: application, error: insertError } = await supabase
      .from('JobApplication')
      .insert({
        id: crypto.randomUUID(),
        jobId,
        studentId: profile.id,
        resumeUrl,
        status: 'applied',
        appliedAt: now,
        updatedAt: now,
      })
      .select()
      .single();

    if (insertError) {
      if (insertError.code === '23505') { // Unique constraint (already applied)
        return NextResponse.json({ error: 'You have already applied for this job.' }, { status: 400 });
      }
      throw insertError;
    }

    return NextResponse.json(
      { message: 'Application submitted over HTTPS successfully!', application },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Job application error:', error.message);
    return NextResponse.json({ error: error.message || 'Internal server error over HTTPS' }, { status: 500 });
  }
}

// GET /api/applications - Fetch student's own applications via HTTPS
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;

  try {
    // 1. Get student profile first
    const { data: profile } = await supabase
      .from('StudentProfile')
      .select('id')
      .eq('userId', userId)
      .single();

    if (!profile) {
       return NextResponse.json({ applications: [] }, { status: 200 });
    }

    // 2. Fetch applications with relational joins via HTTPS
    const { data: applications, error } = await supabase
      .from('JobApplication')
      .select(`
        *,
        job:JobListing(
          role,
          location,
          salaryCtc,
          company:Company(name)
        )
      `)
      .eq('studentId', profile.id)
      .order('appliedAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications: applications || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch applications error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch tracking data over HTTPS' }, { status: 500 });
  }
}
