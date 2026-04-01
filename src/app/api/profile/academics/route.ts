import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/models/StudentProfile';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const profile = await StudentProfile.findOne({
    userId: (session.user as { id: string }).id,
  }).lean();

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found. Please complete your basic profile first.' }, { status: 404 });
  }

  return NextResponse.json({
    currentSemester: profile.currentSemester,
    academicDetails: profile.academicDetails || { semesters: [], cgpa: 0, activeBacklogs: 0 },
  }, { status: 200 });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const { semesters, activeBacklogs } = body;

  if (!Array.isArray(semesters)) {
    return NextResponse.json({ error: 'Invalid data format for semesters.' }, { status: 400 });
  }

  // Calculate CGPA
  const validSemesters = semesters.filter(s => s.gpa > 0);
  const totalGpa = validSemesters.reduce((sum, s) => sum + Number(s.gpa), 0);
  const cgpa = validSemesters.length > 0 ? Number((totalGpa / validSemesters.length).toFixed(2)) : 0;

  await connectDB();

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      {
        $set: {
          'academicDetails.semesters': semesters,
          'academicDetails.cgpa': cgpa,
          'academicDetails.activeBacklogs': Number(activeBacklogs) || 0,
        }
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found. Please complete your basic profile first.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Academic details saved successfully.', academicDetails: profile.academicDetails }, { status: 200 });
  } catch (error: any) {
    console.error('Academic details save error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error.' }, { status: 500 });
  }
}
