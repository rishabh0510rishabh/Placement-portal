import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const branch = searchParams.get('branch') || '';
    const minCgpa = parseFloat(searchParams.get('minCgpa') || '0');
    const id = searchParams.get('id');

    // Mongoose aggregation to join User and StudentProfile
    const pipeline: any[] = [
      { $match: { role: 'student' } },
    ];

    if (id) {
      pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(id) } });
    }

    pipeline.push(
      {
        $lookup: {
          from: 'studentprofiles',
          localField: '_id',
          foreignField: 'userId',
          as: 'profile'
        }
      },
      {
        $unwind: {
          path: '$profile',
          preserveNullAndEmptyArrays: true
        }
      }
    );

    // Search by name or email
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { 'profile.rollNumber': { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Filter by branch
    if (branch) {
      pipeline.push({
        $match: { 'profile.branch': branch }
      });
    }

    // Filter by CGPA
    if (minCgpa > 0) {
      pipeline.push({
        $match: { 'profile.academicDetails.cgpa': { $gte: minCgpa } }
      });
    }

    // Sort by name
    pipeline.push({ $sort: { name: 1 } });

    const students = await User.aggregate(pipeline);

    return NextResponse.json({ students }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch students error:', error);
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 });
  }
}
