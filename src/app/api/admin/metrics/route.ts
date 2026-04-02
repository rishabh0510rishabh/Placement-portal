import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import JobListing from '@/models/JobListing';
import JobApplication from '@/models/JobApplication';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || (session.user as any).role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const [totalStudents, totalApplications, shortlistedStudents, jobListings] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      JobApplication.countDocuments(),
      JobApplication.countDocuments({ status: { $in: ['shortlisted', 'hired', 'interviewing'] } }),
      JobListing.find({}, 'companyName').lean()
    ]);

    // Calculate unique companies
    const uniqueCompanies = new Set(jobListings.map(job => job.companyName));
    const totalCompanies = uniqueCompanies.size;

    return NextResponse.json({
      metrics: {
        totalStudents,
        totalCompanies,
        totalApplications,
        shortlistedStudents
      }
    }, { status: 200 });
  } catch (error: any) {
    console.error('Fetch admin metrics error:', error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}
