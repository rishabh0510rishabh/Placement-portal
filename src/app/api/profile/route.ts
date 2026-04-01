import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/models/StudentProfile';

// GET /api/profile — fetch the current student's profile
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
    return NextResponse.json({ profile: null }, { status: 200 });
  }

  return NextResponse.json({ profile }, { status: 200 });
}

// POST /api/profile — create or update the current student's profile
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const {
    fullName,
    rollNumber,
    collegeId,
    branch,
    section,
    phoneNumber,
    email,
    currentSemester,
  } = body;

  // Validate required fields
  if (
    !fullName ||
    !rollNumber ||
    !collegeId ||
    !branch ||
    !section ||
    !phoneNumber ||
    !email ||
    !currentSemester
  ) {
    return NextResponse.json(
      { error: 'All fields are required.' },
      { status: 400 }
    );
  }

  // Validate phone number
  if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
    return NextResponse.json(
      { error: 'Please enter a valid 10-digit Indian mobile number.' },
      { status: 400 }
    );
  }

  // Validate semester range
  const sem = Number(currentSemester);
  if (sem < 1 || sem > 8) {
    return NextResponse.json(
      { error: 'Semester must be between 1 and 8.' },
      { status: 400 }
    );
  }

  await connectDB();

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        fullName,
        rollNumber,
        collegeId,
        branch,
        section: section.toUpperCase(),
        phoneNumber,
        email: email.toLowerCase(),
        currentSemester: sem,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json(
      { message: 'Profile saved successfully.', profile },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Profile save error:', error);
    if (error instanceof Error && error.message.includes('E11000')) {
      return NextResponse.json(
        { error: 'Roll number already exists. Please check your roll number.' },
        { status: 409 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
