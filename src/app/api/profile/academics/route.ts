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
    // 1. Get student profile ID (create if missing)
    let { data: profile } = await supabase
      .from('StudentProfile')
      .select('id')
      .eq('userId', userId)
      .single();

    if (!profile) {
      const { data: newProfile, error: profileError } = await supabase
        .from('StudentProfile')
        .insert({
          id: crypto.randomUUID(),
          userId: userId,
          fullName: session.user?.name || 'Student',
          email: session.user?.email || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .select('id')
        .single();
      
      if (profileError) throw profileError;
      profile = newProfile;
    }

    if (!profile) return NextResponse.json({ error: 'Profile unavailable' }, { status: 500 });

    // 2. Update overall CGPA in profile
    const { error: updateError } = await supabase
      .from('StudentProfile')
      .update({ 
        cgpa: cgpa || 0,
        updatedAt: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    // 3. Sync Semester GPAs using ID-based upsert to avoid missing composite constraint errors
    const { data: existingGPAs } = await supabase
      .from('SemesterGPA')
      .select('id, semester')
      .eq('studentProfileId', profile.id);

    const upsertRows = Object.entries(gpas).map(([semester, gpa]) => {
      const semNum = parseInt(semester);
      const gpaNum = parseFloat(gpa as string);
      if (isNaN(gpaNum) || gpaNum === 0) return null;
      
      const match = existingGPAs?.find(e => e.semester === semNum);
      
      return {
        id: match?.id || crypto.randomUUID(),
        studentProfileId: profile.id,
        semester: semNum,
        gpa: gpaNum
      };
    }).filter(row => row !== null);

    if (upsertRows.length > 0) {
      const { error: upsertError } = await supabase
        .from('SemesterGPA')
        .upsert(upsertRows as any[]); // Defaults to PK (id)
      
      if (upsertError) throw upsertError;
    }

    return NextResponse.json({ message: 'Academics updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Save academics error:', error.message);
    return NextResponse.json({ error: 'Failed to update academic records' }, { status: 500 });
  }
}

