import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/models/StudentProfile';

const VALID_CATEGORIES = [
  'programmingLanguages',
  'frameworks',
  'tools',
  'databases',
  'technologies',
] as const;

type SkillCategory = (typeof VALID_CATEGORIES)[number];

// GET /api/profile/skills
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const profile = await StudentProfile.findOne({
    userId: (session.user as { id: string }).id,
  })
    .select('skills')
    .lean();

  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found. Please complete your basic profile first.' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      skills: profile.skills ?? {
        programmingLanguages: [],
        frameworks: [],
        tools: [],
        databases: [],
        technologies: [],
      },
    },
    { status: 200 }
  );
}

// POST /api/profile/skills
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  // Validate each category is an array of strings
  const sanitised: Partial<Record<SkillCategory, string[]>> = {};

  for (const cat of VALID_CATEGORIES) {
    const raw = body[cat];
    if (raw !== undefined) {
      if (!Array.isArray(raw)) {
        return NextResponse.json(
          { error: `"${cat}" must be an array of strings.` },
          { status: 400 }
        );
      }
      sanitised[cat] = (raw as unknown[])
        .map((s) => String(s).trim())
        .filter((s) => s.length > 0);
    } else {
      sanitised[cat] = [];
    }
  }

  await connectDB();

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: { skills: sanitised } },
      { new: true, runValidators: true }
    ).select('skills');

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your basic profile first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Skills saved successfully.', skills: profile.skills },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Skills save error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error.' },
      { status: 500 }
    );
  }
}
