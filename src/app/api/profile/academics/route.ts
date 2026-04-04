import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { gpas, cgpa } = await req.json();

  try {
    // 1. Get student profile ID over HTTPS
    const { data: profile, error: profileError } = await supabase
      .from('StudentProfile')
      .select('id')
      .eq('userId', userId)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found. Please complete basic profile first.' }, { status: 404 });
    }

    // 2. Update overall CGPA in profile
    const { error: updateError } = await supabase
      .from('StudentProfile')
      .update({ cgpa: cgpa || 0 })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    // 3. Upsert individual semester GPAs
    const upsertRows = Object.entries(gpas).map(([semester, gpa]) => {
      const semNum = parseInt(semester);
      const gpaNum = parseFloat(gpa as string);
      if (isNaN(gpaNum) || gpaNum === 0) return null;
      return {
        id: `${profile.id}_sem_${semNum}`, // Deterministic ID for upsert
        studentProfileId: profile.id,
        semester: semNum,
        gpa: gpaNum
      };
    }).filter(row => row !== null);

    if (upsertRows.length > 0) {
      const { error: upsertError } = await supabase
        .from('SemesterGPA')
        .upsert(upsertRows);
      if (upsertError) throw upsertError;
    }

    return NextResponse.json({ message: 'Academics updated successfully via HTTPS.' }, { status: 200 });
  } catch (error: any) {
    console.error('Save academics error:', error.message);
    return NextResponse.json({ error: 'Failed to update academic records over HTTPS.' }, { status: 500 });
  }
}
