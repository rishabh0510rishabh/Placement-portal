'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './reports.module.css';

interface Job {
  _id: string;
  companyName: string;
  role: string;
}

export default function AdminReportsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/dashboard');
    } else if (status === 'authenticated') {
      fetchJobs();
    }
  }, [status, session, router]);

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs for reports:', err);
    }
  };

  const downloadReport = async (type: string) => {
    setLoading(true);
    try {
      let url = `/api/admin/reports?type=${type}`;
      if (type === 'applications' && selectedJobId) {
        url += `&jobId=${selectedJobId}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to generate report');

      const blob = await res.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const filename = res.headers.get('Content-Disposition')?.split('filename=')[1]?.replace(/"/g, '') || `${type}_report.csv`;
      link.setAttribute('download', filename);
      
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Administrative Reports</h1>
        <p className={styles.subtitle}>Export essential portal data to CSV for record-keeping (Task 19)</p>
      </header>

      <div className={styles.reportsGrid}>
        
        {/* Student Report */}
        <div className={styles.reportCard}>
          <span className={styles.reportLabel}>Full Student Directory</span>
          <p className={styles.reportDesc}>
            Export a list of all registered students including their branch, section, roll number, and current placement status.
          </p>
          <div className={styles.reportAction}>
            <button className={styles.downloadBtn} onClick={() => downloadReport('students')} disabled={loading}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Student CSV
            </button>
          </div>
        </div>

        {/* Placed Report */}
        <div className={styles.reportCard}>
          <span className={styles.reportLabel}>Placement Ledger</span>
          <p className={styles.reportDesc}>
            Generate a concise report of all students who have successfully achieved placement offers through the portal.
          </p>
          <div className={styles.reportAction}>
            <button className={styles.downloadBtn} onClick={() => downloadReport('placed')} disabled={loading}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Download Placement CSV
            </button>
          </div>
        </div>

        {/* Job Applications Report */}
        <div className={styles.reportCard}>
          <span className={styles.reportLabel}>Application Insights</span>
          <p className={styles.reportDesc}>
            Export a history of job applications. You can filter by a specific job posting to narrow down results.
          </p>
          <div className={styles.reportAction}>
            <select 
              className={styles.select} 
              value={selectedJobId} 
              onChange={(e) => setSelectedJobId(e.target.value)}
              title="Job Filtering for Application Report"
            >
              <option value="">All Job Applications</option>
              {jobs.map(job => (
                <option key={job._id} value={job._id}>
                  {job.companyName} - {job.role}
                </option>
              ))}
            </select>
            <button className={styles.downloadBtn} onClick={() => downloadReport('applications')} disabled={loading}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Download Application CSV
            </button>
          </div>
        </div>

      </div>

      {loading && (
        <div className={styles.loadingOverlay}>
          <div className="spinner"></div>
          <p className={styles.loadingText}>Generating Spreadsheet...</p>
        </div>
      )}
    </div>
  );
}
