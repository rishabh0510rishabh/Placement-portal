import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const resolvedParams = await params;
  const notificationId = resolvedParams.id;

  try {
    // 1. Update notification read status via HTTPS SDK
    const { data: notification, error } = await supabase
      .from('Notification')
      .update({ read: true })
      .eq('id', notificationId)
      .eq('userId', userId)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // Record not found
         return NextResponse.json({ error: 'Notification not found' }, { status: 404 });
      }
      throw error;
    }

    return NextResponse.json({ 
      message: 'Notification marked as read over HTTPS', 
      notification 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Update notification error:', error.message);
    return NextResponse.json({ error: 'Failed to update notification over HTTPS' }, { status: 500 });
  }
}
