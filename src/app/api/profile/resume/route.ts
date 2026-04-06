import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

// POST /api/profile/resume — Save via HTTPS
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { resumeUrl, resumeFilename } = await req.json();

  try {
    const { data: profile, error } = await supabase
      .from('StudentProfile')
      .update({
        resumeUrl,
        resumeFilename,
        resumeUploadedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      .eq('userId', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Resume updated successfully via HTTPS.', profile }, { status: 200 });
  } catch (error: any) {
    console.error('Save resume error:', error.message);
    return NextResponse.json({ error: 'Failed to update professional document over HTTPS.' }, { status: 500 });
  }
}

// DELETE /api/profile/resume — Clear via HTTPS
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  try {
    const { data: profile, error } = await supabase
      .from('StudentProfile')
      .update({
        resumeUrl: null,
        resumeFilename: null,
        resumeUploadedAt: null,
        updatedAt: new Date().toISOString()
      })
      .eq('userId', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Resume cleared successfully over HTTPS.', profile }, { status: 200 });
  } catch (error: any) {
    console.error('Delete resume error:', error.message);
    return NextResponse.json({ error: 'Failed to clear document.' }, { status: 500 });
  }
}
