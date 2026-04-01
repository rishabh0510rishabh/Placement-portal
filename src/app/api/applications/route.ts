import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import JobListing from '@/models/JobListing';

// POST /api/applications
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

    await connectDB();

    // Verify job exists and is active
    const job = await JobListing.findById(jobId).lean();
    if (!job) {
      return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
    }
    
    if (job.status !== 'active') {
      return NextResponse.json({ error: 'This job is no longer accepting applications.' }, { status: 400 });
    }

    // Check if already applied
    const existingApplication = await JobApplication.findOne({ jobId, userId });
    if (existingApplication) {
      return NextResponse.json({ error: 'You have already applied for this job.' }, { status: 400 });
    }

    const application = await JobApplication.create({
      jobId,
      userId,
      resumeUrl,
    });

    return NextResponse.json(
      { message: 'Application submitted successfully!', application },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Job application error:', error);
    // Handle mongoose duplicate key error explicitly just in case
    if (error.code === 11000) {
      return NextResponse.json({ error: 'You have already applied for this job.' }, { status: 400 });
    }
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
