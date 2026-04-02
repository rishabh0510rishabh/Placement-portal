import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const jobId = searchParams.get('jobId');
  const statusFilter = searchParams.get('status');

  try {
    await connectDB();

    const pipeline: any[] = [
      // 1. Join with User
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      // 2. Join with StudentProfile
      {
        $lookup: {
          from: 'studentprofiles',
          localField: 'userId',
          foreignField: 'userId',
          as: 'studentProfile'
        }
      },
      { $unwind: { path: '$studentProfile', preserveNullAndEmptyArrays: true } },
      // 3. Join with JobListing
      {
        $lookup: {
          from: 'joblistings',
          localField: 'jobId',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      // 4. Project fields
      {
        $project: {
          _id: 1,
          resumeUrl: 1,
          status: 1,
          createdAt: 1,
          'user.name': 1,
          'user.email': 1,
          'studentProfile.rollNumber': 1,
          'studentProfile.branch': 1,
          'studentProfile.academicDetails.cgpa': 1,
          'job._id': 1,
          'job.companyName': 1,
          'job.role': 1,
        }
      }
    ];

    // Apply filters
    const matchFilters: any = {};
    if (jobId && mongoose.isValidObjectId(jobId)) {
      matchFilters.jobId = new mongoose.Types.ObjectId(jobId);
    }
    if (statusFilter) {
      matchFilters.status = statusFilter;
    }

    // Insert filters at beginning of pipeline if any
    if (Object.keys(matchFilters).length > 0) {
      pipeline.unshift({ $match: matchFilters });
    }

    const applications = await JobApplication.aggregate(pipeline).sort({ createdAt: -1 });

    return NextResponse.json({ applications }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch admin applications error:', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}
