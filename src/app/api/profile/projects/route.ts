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
    let { data: profile } = await supabase
      .from('StudentProfile')
      .select('id')
      .eq('userId', userId)
      .single();

    // If profile doesn't exist (e.g. registration error), create a stub
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

    const { data: project, error } = await supabase
      .from('Project')
      .upsert({
        id: id || undefined,
        studentProfileId: profile.id,
        title,
        description,
        technologies,
        githubLink
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ message: 'Project saved successfully', project }, { status: 200 });
  } catch (error: any) {
    console.error('Project save error:', error.message);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
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
