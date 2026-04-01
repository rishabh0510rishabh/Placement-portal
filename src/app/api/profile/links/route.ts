import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/models/StudentProfile';

// GET /api/profile/links
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const profile = await StudentProfile.findOne({
    userId: (session.user as { id: string }).id,
  })
    .select('links')
    .lean();

  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found. Please complete your basic profile first.' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { links: profile.links || { linkedin: '', github: '', portfolio: '', leetcode: '' } },
    { status: 200 }
  );
}

// POST /api/profile/links
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const { links } = body;

  if (!links || typeof links !== 'object') {
    return NextResponse.json(
      { error: 'Invalid data format. Expected a links object.' },
      { status: 400 }
    );
  }

  const sanitizedLinks: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    leetcode?: string;
  } = {};

  // Simple URL validation (can be more robust in production)
  const isValidUrl = (url: string) => {
    if (!url) return true; // empty strings are okay (clearing fields)
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fields = ['linkedin', 'github', 'portfolio', 'leetcode'];
  
  for (const field of fields) {
    const val = String(links[field] || '').trim();
    if (val && !isValidUrl(val)) {
      return NextResponse.json(
        { error: `Please provide a valid URL for ${field}. Must include http:// or https://` },
        { status: 400 }
      );
    }
    sanitizedLinks[field as keyof typeof sanitizedLinks] = val;
  }

  await connectDB();

  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: { links: sanitizedLinks } },
      { new: true, runValidators: true }
    ).select('links');

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your basic profile first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Professional links saved successfully.', links: profile.links },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Links save error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error.' },
      { status: 500 }
    );
  }
}
