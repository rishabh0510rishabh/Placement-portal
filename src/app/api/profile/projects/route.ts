import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

// POST /api/profile/projects — Add or update a project via HTTPS
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const { id, title, description, technologies, githubLink } = await req.json();

  try {
    const { data: profile } = await supabase
      .from('StudentProfile')
      .select('id')
      .eq('userId', userId)
      .single();

    if (!profile) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const newId = id || `proj_${Date.now()}`;
    const { data: project, error } = await supabase
      .from('Project')
      .upsert({
        id: id || undefined, // Supabase generates if empty, or we pass existing
        studentProfileId: profile.id,
        title,
        description,
        technologies,
        githubLink
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Project saved via HTTPS', project }, { status: 200 });
  } catch (error: any) {
    console.error('Project save error:', error.message);
    return NextResponse.json({ error: 'Failed to save project over HTTPS' }, { status: 500 });
  }
}

// DELETE /api/profile/projects — Delete a project via HTTPS
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Project ID required' }, { status: 400 });

  try {
    const { error } = await supabase
      .from('Project')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Project deleted over HTTPS' }, { status: 200 });
  } catch (error: any) {
    console.error('Project delete error:', error.message);
    return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 });
  }
}
