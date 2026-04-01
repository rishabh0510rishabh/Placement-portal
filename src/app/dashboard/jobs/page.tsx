'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './jobs.module.css';
import profileStyles from '../profile/profile.module.css';

interface Job {
  _id: string;
  companyName: string;
  role: string;
  description: string;
  minimumCgpa: number;
  allowedBranches: string[];
  maximumBacklogs: number;
  salaryCtc: string;
  ctcBreakdown: string;
  location: string;
  deadline: string;
  status: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // We should ideally fetch the user's role to conditionally show "Create Job" button.
  // For now, we'll assume standard layout display. Admin validation happens in API.

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        
        if (res.ok) {
          setJobs(data.jobs || []);
        } else {
          setError(data.error || 'Failed to fetch jobs.');
        }
      } catch {
        setError('Failed to fetch jobs.');
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className={profileStyles.loadingWrapper}>
        <span className="spinner" /> Loading active jobs...
      </div>
    );
  }

  return (
    <div className={profileStyles.container}>
      <div className={styles.headerRow}>
        <div className={profileStyles.header}>
          <h1 className={profileStyles.title}>Company Job Listings</h1>
          <p className={profileStyles.subtitle}>
            Explore and apply for the latest placement opportunities. 
          </p>
        </div>
        
        {/* Placeholder: Only Admins should logically go here, but this is a CTA placeholder for testing */}
        <Link href="/dashboard/admin/jobs/new" className="btn btn-outline" style={{ height: 'max-content' }}>
          + Add New Job (Admin)
        </Link>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className={styles.jobList}>
        {jobs.length === 0 && !error ? (
          <div className={styles.emptyState}>
            <p>No active job listings found right now. Check back later!</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className={styles.jobCard}>
              <div className={styles.jobHeader}>
                <div>
                  <h2 className={styles.roleTitle}>{job.role}</h2>
                  <h3 className={styles.companyName}>{job.companyName}</h3>
                </div>
                <div className={styles.salaryBadge}>{job.salaryCtc}</div>
              </div>

              <div className={styles.jobDetailsGrid}>
                <div className={styles.detailItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{job.location}</span>
                </div>
                <div className={styles.detailItem}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <span>Apply by {new Date(job.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              <div className={styles.criteriaGroup}>
                <span className={styles.criteriaBadge}>Min CGPA: {job.minimumCgpa}</span>
                <span className={styles.criteriaBadge}>Max Backlogs: {job.maximumBacklogs}</span>
                <div className={styles.branchesList}>
                  {job.allowedBranches.map((branch) => (
                    <span key={branch} className={styles.branchTag}>{branch}</span>
                  ))}
                </div>
              </div>

              <div className={styles.description}>
                <p>{job.description}</p>
                {job.ctcBreakdown && (
                  <p className={styles.breakdown}><strong>CTC Breakdown:</strong> {job.ctcBreakdown}</p>
                )}
              </div>

              <div className={styles.footerActions}>
                <Link href={`/dashboard/jobs/${job._id}`} className="btn btn-primary">
                  View Details & Apply
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
