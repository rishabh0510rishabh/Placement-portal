import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import StudentProfile from '@/models/StudentProfile';
import JobApplication from '@/models/JobApplication';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get('type');

  try {
    await connectDB();

    let csvContent = "";
    let filename = "report.csv";

    if (type === 'students') {
      filename = "all_students_report.csv";
      const students = await User.aggregate([
        { $match: { role: 'student' } },
        {
          $lookup: {
            from: 'studentprofiles',
            localField: '_id',
            foreignField: 'userId',
            as: 'profile'
          }
        },
        { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } }
      ]);

      const headers = ["Name", "Email", "Roll Number", "Branch", "Section", "CGPA", "Placed Status"];
      csvContent = [
        headers.join(','),
        ...students.map(s => [
          `"${s.name}"`,
          `"${s.email}"`,
          `"${s.profile?.rollNumber || '-'}"`,
          `"${s.profile?.branch || '-'}"`,
          `"${s.profile?.section || '-'}"`,
          `"${s.profile?.academicDetails?.cgpa || '0'}"`,
          `"${s.profile?.isPlaced ? 'Placed' : 'Unplaced'}"`
        ].join(','))
      ].join('\n');

    } else if (type === 'applications') {
      const jobId = searchParams.get('jobId');
      filename = "job_applications_report.csv";

      const query = jobId ? { jobId } : {};
      const applications = await JobApplication.find(query)
        .populate('userId', 'name email')
        .populate('jobId', 'companyName role')
        .lean();

      const headers = ["Student Name", "Email", "Company", "Job Role", "Application Status", "Applied Date"];
      csvContent = [
        headers.join(','),
        ...applications.map((app: any) => [
          `"${app.userId?.name || 'Unknown'}"`,
          `"${app.userId?.email || 'Unknown'}"`,
          `"${app.jobId?.companyName || 'Unknown'}"`,
          `"${app.jobId?.role || 'Unknown'}"`,
          `"${app.status}"`,
          `"${new Date(app.createdAt).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

    } else if (type === 'placed') {
      filename = "placed_students_report.csv";
      const placed = await JobApplication.find({ status: 'hired' })
        .populate('userId', 'name email')
        .populate('jobId', 'companyName role')
        .lean();

      const headers = ["Student Name", "Email", "Company", "Job Role", "Hired Date"];
      csvContent = [
        headers.join(','),
        ...placed.map((app: any) => [
          `"${app.userId?.name || 'Unknown'}"`,
          `"${app.userId?.email || 'Unknown'}"`,
          `"${app.jobId?.companyName || 'Unknown'}"`,
          `"${app.jobId?.role || 'Unknown'}"`,
          `"${new Date(app.updatedAt).toLocaleDateString()}"`
        ].join(','))
      ].join('\n');

    } else {
      return NextResponse.json({ error: 'Invalid report type' }, { status: 400 });
    }

    return new Response(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });

  } catch (error: any) {
    console.error('Reports generation error:', error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}
