import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// GET /api/admin/students - Fetch all student profiles for admin management
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: students, error } = await supabase
      .from('UserProfile') // Or wherever profile is stored, let's check StudentProfile
      .select(`
        *,
        user:User(email, fullName)
      `)
      .order('fullName', { ascending: true });

    // Since our schema uses 'StudentProfile' for details and 'User' for auth
    const { data: profiles, error: profileError } = await supabase
      .from('StudentProfile')
      .select('*')
      .order('fullName', { ascending: true });

    if (profileError) throw profileError;

    return NextResponse.json({ students: profiles || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch students admin error:', error.message);
    return NextResponse.json({ error: 'Failed to aggregate candidate directory' }, { status: 500 });
  }
}
