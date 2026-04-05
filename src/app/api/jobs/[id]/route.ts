import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';
import { Branch } from '@/types/database';

export const dynamic = 'force-dynamic';

// GET /api/jobs/[id] - Fetch single job details and calculate eligibility via HTTPS
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const jobId = resolvedParams.id;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  try {
    // 1. Fetch job with company details over HTTPS
    const { data: job, error: jobError } = await supabase
      .from('JobListing')
      .select('*, company:Company(*)')
      .eq('id', jobId)
      .single();

    if (jobError || !job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const userId = (session.user as any).id;
    
    // 2. Fetch student profile over HTTPS
    const { data: profile } = await supabase
      .from('StudentProfile')
      .select('*')
      .eq('userId', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ 
        job, 
        eligibility: { 
          isEligible: false, 
          reasons: ['Please complete your academic profile to check job eligibility.'] 
        } 
      }, { status: 200 });
    }

    // 3. Eligibility Logic Calculation
    const reasons: string[] = [];
    let isEligible = true;

    // A. Branch Validation
    if (job.allowedBranches && job.allowedBranches.length > 0) {
      const isAllowed = job.allowedBranches.includes(profile.branch) || job.allowedBranches.includes('All' as any);
      if (!isAllowed) {
        isEligible = false;
        reasons.push(`Your branch (${profile.branch}) is not eligible for this role at ${job.company?.name}.`);
      }
    }

    // B. CGPA Validation
    const currentCgpa = profile.cgpa || 0;
    if (currentCgpa < (job.minimumCgpa || 0)) {
      isEligible = false;
      reasons.push(`Your CGPA (${currentCgpa}) is below the required minimum of ${job.minimumCgpa}.`);
    }

    // C. Backlogs Validation
    const activeBacklogs = profile.activeBacklogs || 0;
    if (activeBacklogs > (job.maximumBacklogs || 0)) {
      isEligible = false;
      reasons.push(`You have ${activeBacklogs} active backlogs. Maximum allowed for this role is ${job.maximumBacklogs}.`);
    }

    // D. Soft Skill Matching
    if (job.requiredSkills && job.requiredSkills.length > 0 && profile.skills) {
      const studentSkills = Object.values(profile.skills).flat().map((s: any) => s.toString().toLowerCase());
      const requiredSkillsLower = job.requiredSkills.map((s: string) => s.toLowerCase());
      const hasMatch = requiredSkillsLower.some((s: string) => studentSkills.includes(s));

      if (!hasMatch) {
         // Soft check: We don't always block application, but we flag it.
         // reasons.push(`Note: Mentioning required skills like ${job.requiredSkills[0]} may improve your chances.`);
      }
    }

    return NextResponse.json({
      job,
      eligibility: { isEligible, reasons }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Job details fetch error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch job eligibility via cloud' }, { status: 500 });
  }
}

// PUT /api/jobs/[id] - Update job (Admin Only) via HTTPS
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const jobId = resolvedParams.id;

  try {
    const body = await req.json();
    
    // Update job over HTTPS
    const { data: updatedJob, error } = await supabase
      .from('JobListing')
      .update(body)
      .eq('id', jobId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Job updated over HTTPS', job: updatedJob }, { status: 200 });
  } catch (error: any) {
    console.error('Job update error:', error.message);
    return NextResponse.json({ error: 'Failed to update job over HTTPS' }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] - Delete job (Admin Only) via HTTPS
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const jobId = resolvedParams.id;

  try {
    const { error } = await supabase
      .from('JobListing')
      .delete()
      .eq('id', jobId);

    if (error) throw error;

    return NextResponse.json({ message: 'Job listing deleted over HTTPS successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Job deletion error:', error.message);
    return NextResponse.json({ error: 'Failed to delete job over HTTPS' }, { status: 500 });
  }
}
