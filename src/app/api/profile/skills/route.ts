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
    // 1. Update the student profile's skills JSON field via HTTPS
    const { error } = await supabase
      .from('StudentProfile')
      .update({ skills })
      .eq('userId', userId);

    if (error) throw error;

    return NextResponse.json({ message: 'Skills saved successfully via HTTPS.' }, { status: 200 });
  } catch (error: any) {
    console.error('Save skills error:', error.message);
    return NextResponse.json({ error: 'Failed to update technical skills over HTTPS.' }, { status: 500 });
  }
}
