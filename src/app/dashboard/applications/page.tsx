'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import styles from './applications.module.css';

interface Application {
  _id: string;
  status: string;
  createdAt: string;
  jobId: {
    _id: string;
    companyName: string;
    role: string;
    ctc: string;
    location: string;
  };
}

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications');
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data.applications);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Applications</h1>
        <p className={styles.subtitle}>Track the status of your job applications</p>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className={styles.emptyState}>
          <svg className={styles.emptyStateIcon} width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3>No Applications Yet</h3>
          <p>You haven't applied to any jobs yet. Start exploring opportunities!</p>
          <Link href="/dashboard/jobs" className={styles.browseButton}>
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className={styles.applicationsGrid}>
          {applications.map((app) => (
            <div key={app._id} className={styles.applicationCard}>
              <div className={styles.cardHeader}>
                <div className={styles.companyInfo}>
                  <h3 className={styles.companyName}>{app.jobId.companyName}</h3>
                  <span className={styles.role}>{app.jobId.role}</span>
                </div>
                <span className={`${styles.statusBadge} ${styles[`status-${app.status}`]}`}>
                  {app.status}
                </span>
              </div>
              
              <div className={styles.jobDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Applied On</span>
                  <span className={styles.detailValue}>{formatDate(app.createdAt)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Location</span>
                  <span className={styles.detailValue}>{app.jobId.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>CTC Package</span>
                  <span className={styles.detailValue}>{app.jobId.ctc}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
