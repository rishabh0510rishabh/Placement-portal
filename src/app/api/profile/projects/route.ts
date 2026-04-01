import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/models/StudentProfile';

// GET /api/profile/projects
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const profile = await StudentProfile.findOne({
    userId: (session.user as { id: string }).id,
  })
    .select('projects')
    .lean();

  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found. Please complete your basic profile first.' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { projects: profile.projects || [] },
    { status: 200 }
  );
}

// POST /api/profile/projects
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const { projects } = body;

  if (!Array.isArray(projects)) {
    return NextResponse.json(
      { error: 'Invalid data format. Expected an array of projects.' },
      { status: 400 }
    );
  }

  // Validate fields for each project
  const sanitizedProjects = projects.map((p: any) => ({
    title: String(p.title || '').trim(),
    description: String(p.description || '').trim(),
    technologies: Array.isArray(p.technologies)
      ? p.technologies.map((t: any) => String(t).trim()).filter((t: string) => t)
      : [],
    githubLink: p.githubLink ? String(p.githubLink).trim() : undefined,
  }));

  // Check required fields
  for (const p of sanitizedProjects) {
    if (!p.title || !p.description) {
      return NextResponse.json(
        { error: 'Title and description are required for all projects.' },
        { status: 400 }
      );
    }
  }

  await connectDB();

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: { projects: sanitizedProjects } },
      { new: true, runValidators: true }
    ).select('projects');

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your basic profile first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Projects saved successfully.', projects: profile.projects },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Projects save error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
