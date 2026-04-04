import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Fetch all student profiles via HTTPS
    const { data: students, error } = await supabase
      .from('StudentProfile')
      .select('*')
      .order('fullName', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ students: students || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch admin students error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch student data via cloud' }, { status: 500 });
  }
}
