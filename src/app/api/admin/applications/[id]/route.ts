import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import JobApplication from '@/models/JobApplication';

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

    const application = await JobApplication.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    );

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
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
