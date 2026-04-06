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
    // 1. Fetch applications with relational joins via HTTPS
    const { data: applications, error } = await supabase
      .from('JobApplication')
      .select(`
        *,
        student:StudentProfile(fullName, email),
        job:JobListing(
          role,
          company:Company(name)
        )
      `)
      .order('appliedAt', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ applications: applications || [] }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch admin applications error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch applications over HTTPS' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    
    // 2. Update status via HTTPS SDK
    const { data: updated, error } = await supabase
      .from('JobApplication')
      .update({ 
        status,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ application: updated }, { status: 200 });
  } catch (error: any) {
    console.error('Update status error:', error.message);
    return NextResponse.json({ error: 'Failed to update application status over HTTPS' }, { status: 500 });
  }
}
