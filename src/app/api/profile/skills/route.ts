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
  const { skills } = await req.json();

  try {
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

    // 1. Update the student profile's skills JSON field via HTTPS
    const { error } = await supabase
      .from('StudentProfile')
      .update({ 
        skills,
        updatedAt: new Date().toISOString()
      })
      .eq('id', profile.id);

    if (error) throw error;

    return NextResponse.json({ message: 'Skills saved successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Save skills error:', error.message);
    return NextResponse.json({ error: 'Failed to update technical skills' }, { status: 500 });
  }
}

