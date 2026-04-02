'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './admin-applications.module.css';

interface Application {
  _id: string;
  resumeUrl: string;
  status: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  studentProfile?: {
    rollNumber: string;
    branch: string;
    academicDetails: {
      cgpa: number;
    };
  };
  job: {
    _id: string;
    companyName: string;
    role: string;
  };
}

interface JobOption {
  _id: string;
  companyName: string;
  role: string;
}

export default function AdminApplicationsPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<JobOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchingJobs, setFetchingJobs] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [jobId, setJobId] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data.jobs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setFetchingJobs(false);
    }
  };

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (jobId) query.append('jobId', jobId);
      if (statusFilter) query.append('status', statusFilter);

      const res = await fetch(`/api/admin/applications?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data.applications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [jobId, statusFilter]);

  useEffect(() => {
    if (sessionStatus === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/dashboard');
    } else if (sessionStatus === 'authenticated') {
      fetchJobs();
      fetchApplications();
    }
  }, [sessionStatus, session, router, fetchApplications]);

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      // Update local state
      setApplications(prev => 
        prev.map(app => app._id === id ? { ...app, status: newStatus } : app)
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleReset = () => {
    setJobId('');
    setStatusFilter('');
  };

  if (sessionStatus === 'loading') {
    return <div className={styles.loadingContainer}><div className="spinner"></div></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Manage Applications</h1>
        <p className={styles.subtitle}>Review applicants and track status updates (Task 16 & 17)</p>
      </header>

      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Filter by Job Placement</label>
          <select 
            className={styles.filterSelect}
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            disabled={fetchingJobs}
            title="Filter by Job Placement"
          >
            <option value="">All Jobs</option>
            {jobs.map(job => (
              <option key={job._id} value={job._id}>
                {job.companyName} - {job.role}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Status</label>
          <select 
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            title="Filter by Application Status"
          >
            <option value="">All Statuses</option>
            <option value="applied">Applied</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interviewing">Interviewing</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>

        <button className={styles.resetButton} onClick={handleReset}>
          Reset Filters
        </button>
      </div>

      {error && <div className="alert alert-error mb-4">{error}</div>}

      <div className={styles.listCard}>
        {loading ? (
          <div className={styles.loadingContainer}><div className="spinner"></div></div>
        ) : applications.length === 0 ? (
          <div className={styles.emptyState}>No applications found matching the current filters.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Branch / Roll</th>
                  <th>Job Posting</th>
                  <th>CGPA</th>
                  <th>Resume</th>
                  <th>Status Update</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <div className={styles.nameCell}>
                        <span className={styles.studentName}>{app.user.name}</span>
                        <span className={styles.studentEmail}>{app.user.email}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.rollNumber}>{app.studentProfile?.rollNumber || '-'}</div>
                      <div className={styles.branchName}>{app.studentProfile?.branch || '-'}</div>
                    </td>
                    <td>
                      <div className={styles.jobInfo}>
                        <span className={styles.companyName}>{app.job.companyName}</span>
                        <span className={styles.roleName}>{app.job.role}</span>
                      </div>
                    </td>
                    <td>
                      <span className={styles.cgpaValue}>
                        {app.studentProfile?.academicDetails?.cgpa ? app.studentProfile.academicDetails.cgpa.toFixed(2) : '-'}
                      </span>
                    </td>
                    <td>
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.resumeBtn}>
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View
                      </a>
                    </td>
                    <td>
                      <select 
                        className={`${styles.statusSelect} ${styles[`status-${app.status}`]}`}
                        value={app.status}
                        onChange={(e) => updateStatus(app._id, e.target.value)}
                        title="Update Application Status"
                      >
                        <option value="applied">Applied</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="rejected">Rejected</option>
                        <option value="hired">Hired</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
