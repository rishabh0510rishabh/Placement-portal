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

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resolvedParams = await params;
  const applicationId = resolvedParams.id;

  try {
    const { status } = await req.json();

    const validStatuses = ['applied', 'shortlisted', 'interviewing', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // 1. Update application status over HTTPS
    const { data: application, error: updateError } = await supabase
      .from('JobApplication')
      .update({ status })
      .eq('id', applicationId)
      .select('*, job:JobListing(role, company:Company(name))')
      .single();

    if (updateError || !application) {
      return NextResponse.json({ error: 'Application not found over HTTPS' }, { status: 404 });
    }

    // 2. Create notification for the student via HTTPS SDK
    try {
      const job = (application as any).job;
      await supabase.from('Notification').insert({
        userId: application.userId,
        title: 'Application Status Update',
        message: `Your application status for ${job.company?.name} (${job.role}) has been updated to: ${status.toUpperCase()}.`,
        type: 'status_update',
        link: `/student/applications`,
        read: false
      });
    } catch (notifError) {
      console.error('Failed to create notification over HTTPS:', notifError);
    }

    return NextResponse.json({ 
      message: 'Status updated over HTTPS successfully', 
      application 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Update status error:', error.message);
    return NextResponse.json({ error: 'Failed to update status over HTTPS' }, { status: 500 });
  }
}
