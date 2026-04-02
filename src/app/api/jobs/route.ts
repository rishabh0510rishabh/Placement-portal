import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import JobListing from '@/models/JobListing';

// GET /api/jobs - Fetch active job listings
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  // For students, fetch active jobs only. For admins, fetch all jobs.
  const query = (session.user as any).role === 'admin' ? {} : { status: 'active' };

  try {
    const jobs = await JobListing.find(query).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ jobs }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs - Create a new job listing (Admin Only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized. Admin access required.' }, { status: 403 });
  }

  try {
    const body = await req.json();

    // Basic validation
    const requiredFields = [
      'companyName', 'role', 'description', 
      'minimumCgpa', 'allowedBranches', 'maximumBacklogs', 
      'salaryCtc', 'location', 'deadline'
    ];

    for (const field of requiredFields) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        return NextResponse.json({ error: `Field '${field}' is required.` }, { status: 400 });
      }
    }

    await connectDB();

    const newJob = await JobListing.create(body);

    // Create notifications for all students
    try {
      const students = await User.find({ role: 'student' }, '_id');
      const notifications = students.map((student) => ({
        userId: student._id,
        title: 'New Job Posting!',
        message: `${newJob.companyName} is hiring for ${newJob.role}! Check eligibility and apply now.`,
        type: 'job_alert',
        relatedId: (newJob as any)._id,
      }));

      if (notifications.length > 0) {
        await Notification.insertMany(notifications);
      }
    } catch (notifError) {
      console.error('Failed to create broadcast notifications for new job:', notifError);
    }

    return NextResponse.json({ message: 'Job listing created successfully', job: newJob }, { status: 201 });
  } catch (error: any) {
    console.error('Job creation error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

import User from '@/models/User';
import Notification from '@/models/Notification';
