'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './admin-jobs-list.module.css';

interface Job {
  _id: string;
  companyName: string;
  role: string;
  ctc: string;
  status: string;
  applicationDeadline: string;
}

export default function AdminJobsManagementPage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      
      const data = await res.json();
      setJobs(data.jobs);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sessionStatus === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/dashboard');
    } else if (sessionStatus === 'authenticated') {
      fetchJobs();
    }
  }, [sessionStatus, session, router]);

  const handleDelete = async (id: string, companyName: string) => {
    if (!confirm(`Are you sure you want to delete the job posting for ${companyName}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete job');
      
      setJobs(jobs.filter(job => job._id !== id));
    } catch (err: any) {
      alert(err.message);
    }
  };

  const toggleStatus = async (job: Job) => {
    const newStatus = job.status === 'active' ? 'closed' : 'active';
    try {
      const res = await fetch(`/api/jobs/${job._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      
      setJobs(jobs.map(j => j._id === job._id ? { ...j, status: newStatus } : j));
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (sessionStatus === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Company Job Postings</h1>
          <p className={styles.subtitle}>Manage company listings and job roles</p>
        </div>
        <Link href="/dashboard/admin/jobs/new" className={styles.addBtn}>
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
          Add Company / Job
        </Link>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className={styles.jobsList}>
        {loading ? (
          <div className="p-8 flex justify-center"><div className="spinner"></div></div>
        ) : jobs.length === 0 ? (
          <div className={styles.emptyState}>
            No jobs posted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={styles.jobTable}>
              <thead>
                <tr>
                  <th>Company & Role</th>
                  <th>CTC Package</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job._id}>
                    <td>
                      <div className={styles.companyName}>{job.companyName}</div>
                      <div className={styles.jobRole}>{job.role}</div>
                    </td>
                    <td>{job.ctc}</td>
                    <td>{new Date(job.applicationDeadline).toLocaleDateString()}</td>
                    <td>
                      <button 
                        onClick={() => toggleStatus(job)}
                        className={`${styles.statusBadge} ${styles[`status-${job.status}`]} ${styles.statusBtn}`}
                        title="Click to toggle status"
                      >
                        {job.status}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link href={`/dashboard/admin/jobs/${job._id}/edit`} className={styles.editBtn}>
                          Edit
                        </Link>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(job._id, job.companyName)}>
                          Delete
                        </button>
                      </div>
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
