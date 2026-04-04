import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

// POST /api/profile/experience — Create or update via HTTPS
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { id, company, role, startDate, endDate, isCurrentRole, description } = await req.json();

  try {
    const { data: profile } = await supabase
      .from('StudentProfile')
      .select('id')
      .eq('userId', userId)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const { data: experience, error } = await supabase
      .from('WorkExperience')
      .upsert({
        id: id || undefined,
        studentProfileId: profile.id,
        company,
        role,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        isCurrentRole,
        description
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Experience saved over HTTPS', experience }, { status: 200 });
  } catch (error: any) {
    console.error('Save experience error:', error.message);
    return NextResponse.json({ error: 'Failed to update professional history over HTTPS.' }, { status: 500 });
  }
}

// DELETE /api/profile/experience — Remove via HTTPS
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

  try {
    const { error } = await supabase
      .from('WorkExperience')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Experience deleted' }, { status: 200 });
  } catch (error: any) {
    console.error('Delete error:', error.message);
    return NextResponse.json({ error: 'Failed to delete record.' }, { status: 500 });
  }
}
