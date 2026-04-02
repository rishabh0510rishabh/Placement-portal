import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';
import Notification from '@/models/Notification';

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

    await connectDB();

    // Use findById and populate to get job details for the notification message
    const application = await JobApplication.findById(applicationId).populate('jobId');

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    application.status = status;
    await application.save();

    // Create notification for the student
    try {
      const job = application.jobId as any;
      await Notification.create({
        userId: application.userId,
        title: 'Application Status Update',
        message: `Your application status for ${job.companyName} (${job.role}) has been updated to: ${status.toUpperCase()}.`,
        type: 'status_update',
        relatedId: application._id,
      });
    } catch (notifError) {
      console.error('Failed to create notification after status update:', notifError);
      // We don't fail the entire request if just the notification fails
    }

    return NextResponse.json({ 
      message: 'Status updated successfully', 
      application 
    }, { status: 200 });
  } catch (error: any) {
    console.error('Update status error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
