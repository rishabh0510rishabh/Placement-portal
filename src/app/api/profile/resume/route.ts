import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import StudentProfile from '@/models/StudentProfile';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// GET /api/profile/resume
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const profile = await StudentProfile.findOne({
    userId: (session.user as { id: string }).id,
  })
    .select('resume')
    .lean();

  if (!profile) {
    return NextResponse.json(
      { error: 'Profile not found. Please complete your basic profile first.' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { resume: profile.resume || null },
    { status: 200 }
  );
}

// POST /api/profile/resume
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  
  try {
    const formData = await req.formData();
    const file = formData.get('resume') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: 'No resume file provided.' }, { status: 400 });
    }

    // Validate file type (PDF only for safety and standard)
    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'Only PDF files are allowed.' }, { status: 400 });
    }

    // Maximum file size (e.g., 5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size must be less than 5MB.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save to public/uploads/resumes directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'resumes');
    
    try {
      // Ensure directory exists
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // Ignore if exists
    }

    // Delete existing file format if it's there
    const newFilename = `${userId}_${Date.now()}.pdf`;
    const path = join(uploadDir, newFilename);
    const fileUrl = `/uploads/resumes/${newFilename}`;

    await writeFile(path, buffer);

    await connectDB();

    const resumeData = {
      filename: file.name,
      url: fileUrl,
      uploadedAt: new Date(),
    };

    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: { resume: resumeData } },
      { new: true, runValidators: true }
    ).select('resume');

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found. Please complete your basic profile first.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Resume uploaded successfully.', resume: profile.resume },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error during upload.' },
      { status: 500 }
    );
  }
}
