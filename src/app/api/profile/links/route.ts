import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

// POST /api/profile/links — Save via HTTPS
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { linkedin, github, leetcode, portfolio } = await req.json();

  try {
    const { error } = await supabase
      .from('StudentProfile')
      .update({ 
        linkedin, 
        github, 
        leetcode, 
        portfolio,
        updatedAt: new Date().toISOString()
      })
      .eq('userId', userId);

    if (error) throw error;

    return NextResponse.json({ message: 'Links updated successfully via HTTPS.' }, { status: 200 });
  } catch (error: any) {
    console.error('Save links error:', error.message);
    return NextResponse.json({ error: 'Failed to update professional profiles.' }, { status: 500 });
  }
}
