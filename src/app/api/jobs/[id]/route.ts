import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import JobListing from '@/models/JobListing';
import StudentProfile from '@/models/StudentProfile';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Await the params to resolve the dynamic route parameters safely
  const resolvedParams = await params;
  const jobId = resolvedParams.id;

  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  await connectDB();

  try {
    const job = await JobListing.findById(jobId).lean();
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const userId = (session.user as any).id;
    const profile = await StudentProfile.findOne({ userId }).lean();

    if (!profile) {
      return NextResponse.json({ 
        job, 
        eligibility: { 
          isEligible: false, 
          reasons: ['You need to complete your profile to check eligibility.'] 
        } 
      }, { status: 200 });
    }

    // Eligibility Logic Check
    const reasons: string[] = [];
    let isEligible = true;

    // 1. Branch Check
    if (job.allowedBranches && job.allowedBranches.length > 0) {
      if (!job.allowedBranches.includes(profile.branch) && !job.allowedBranches.includes('All')) {
        isEligible = false;
        reasons.push(`Your branch (${profile.branch}) is not eligible for this role.`);
      }
    }

    // 2. CGPA Check
    const currentCgpa = profile.academicDetails?.cgpa || 0;
    if (currentCgpa < job.minimumCgpa) {
      isEligible = false;
      reasons.push(`Your CGPA (${currentCgpa}) is below the required minimum (${job.minimumCgpa}).`);
    }

    // 3. Backlogs Check
    const activeBacklogs = profile.academicDetails?.activeBacklogs || 0;
    if (activeBacklogs > job.maximumBacklogs) {
      isEligible = false;
      reasons.push(`You have too many active backlogs (${activeBacklogs}). Maximum allowed is ${job.maximumBacklogs}.`);
    }

    // 4. Skills Check (Optional soft/hard check)
    if (job.requiredSkills && job.requiredSkills.length > 0) {
      const studentSkills = [
        ...(profile.skills?.programmingLanguages || []),
        ...(profile.skills?.frameworks || []),
        ...(profile.skills?.tools || []),
        ...(profile.skills?.technologies || [])
      ].map(s => s.toLowerCase());

      const requiredSkillsLower = job.requiredSkills.map((s: string) => s.toLowerCase());
      const hasOverlap = requiredSkillsLower.some((s: string) => studentSkills.includes(s));

      if (!hasOverlap) {
        isEligible = false;
        reasons.push(`You fall short of the required skillsets. Mention at least one matching skill to apply.`);
      }
    }

    return NextResponse.json({
      job,
      eligibility: {
        isEligible,
        reasons,
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error fetching job details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
