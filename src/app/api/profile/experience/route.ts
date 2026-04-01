import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/models/StudentProfile';

// GET /api/profile/experience
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const profile = await StudentProfile.findOne({
    userId: (session.user as { id: string }).id,
  })
    .select('experience')
    .lean();

  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found. Please complete your basic profile first.' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { experience: profile.experience || [] },
    { status: 200 }
  );
}

// POST /api/profile/experience
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const { experience } = body;

  if (!Array.isArray(experience)) {
    return NextResponse.json(
      { error: 'Invalid data format. Expected an array of experience items.' },
      { status: 400 }
    );
  }

  // Validate fields for each experience entry
  const sanitizedExperience = experience.map((exp: any) => ({
    company: String(exp.company || '').trim(),
    role: String(exp.role || '').trim(),
    startDate: exp.startDate ? new Date(exp.startDate) : undefined,
    endDate: exp.endDate ? new Date(exp.endDate) : undefined,
    isCurrentRole: Boolean(exp.isCurrentRole),
    description: String(exp.description || '').trim(),
  }));

  // Check required fields
  for (const exp of sanitizedExperience) {
    if (!exp.company || !exp.role || !exp.startDate || !exp.description) {
      return NextResponse.json(
        { error: 'Company, role, start date, and description are required for all experience entries.' },
        { status: 400 }
      );
    }
  }

  await connectDB();

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: { experience: sanitizedExperience } },
      { new: true, runValidators: true }
    ).select('experience');

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your basic profile first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Experience saved successfully.', experience: profile.experience },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Experience save error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
