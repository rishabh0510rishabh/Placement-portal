import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;

  try {
    // 1. Fetching via Supabase HTTPS SDK (Bypasses Port 5432 / 6543 blocks)
    const { data: profile, error } = await supabase
      .from('StudentProfile')
      .select(`
        *,
        semesters:SemesterGPA(*),
        projects:Project(*),
        experience:WorkExperience(*)
      `)
      .eq('userId', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase fetch error:', error);
      throw error;
    }

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch profile error:', error.message);
    return NextResponse.json({ error: 'Failed to connect to cloud database over HTTPS.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const body = await req.json();

  const { fullName, rollNumber, collegeId, branch, section, phoneNumber, email, currentSemester } = body;

  try {
    // 2. Saving via Supabase HTTPS SDK (Instant Write over Port 443)
    const { data: profile, error } = await supabase
      .from('StudentProfile')
      .upsert({ 
        userId, 
        fullName, 
        rollNumber, 
        collegeId, 
        branch, 
        section, 
        phoneNumber, 
        email, 
        currentSemester 
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Profile saved successfully via HTTPS.', profile }, { status: 200 });
  } catch (error: any) {
    console.error('Profile save error:', error.message);
    return NextResponse.json({ error: 'Failed to save changes over HTTPS.' }, { status: 500 });
  }
}
