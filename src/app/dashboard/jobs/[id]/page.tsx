'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './jobDetail.module.css';
import profileStyles from '../../profile/profile.module.css';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [eligibility, setEligibility] = useState<{ isEligible: boolean; reasons: string[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchJobDetails() {
      if (!params || !params.id) return;
      try {
        const res = await fetch(`/api/jobs/${params.id}`);
        const data = await res.json();

        if (res.ok) {
          setJob(data.job);
          setEligibility(data.eligibility);
        } else {
          setError(data.error || 'Failed to load job details.');
        }
      } catch {
        setError('Failed to load job details.');
      } finally {
        setLoading(false);
      }
    }
    fetchJobDetails();
  }, [params]);

  if (loading) {
    return (
      <div className={profileStyles.loadingWrapper}>
        <span className="spinner" /> Loading job details...
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className={profileStyles.container}>
        <div className="alert alert-error">{error || 'Job not found'}</div>
        <button onClick={() => router.push('/dashboard/jobs')} className={`btn btn-outline ${styles.marginTop16}`}>
          &larr; Back to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className={profileStyles.container}>
      
      {/* Dynamic Header */}
      <div className={styles.jobDetailHeader}>
        <div className={styles.headerTitleGroup}>
          <button onClick={() => router.push('/dashboard/jobs')} className={styles.backButton}>
            &larr; Back
          </button>
          <div>
            <h1 className={styles.roleTitle}>{job.role}</h1>
            <h2 className={styles.companyName}>{job.companyName}</h2>
          </div>
        </div>
        <div className={styles.salaryBadgeBig}>{job.salaryCtc}</div>
      </div>

      <div className={profileStyles.card}>
        
        {/* Main Details */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionHeading}>Job Description</h3>
          <p className={styles.descriptionText}>{job.description}</p>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Location</span>
            <span className={styles.infoValue}>{job.location}</span>
          </div>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Application Deadline</span>
            <span className={styles.infoValue}>{new Date(job.deadline).toLocaleString()}</span>
          </div>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>CTC Breakdown</span>
            <span className={styles.infoValue}>{job.ctcBreakdown || 'Not disclosed'}</span>
          </div>
          <div className={styles.infoBox}>
            <span className={styles.infoLabel}>Required Skills</span>
            <span className={styles.infoValue}>
              {job.requiredSkills?.length > 0 ? job.requiredSkills.join(', ') : 'Not specified'}
            </span>
          </div>
        </div>

        <div className={profileStyles.divider} />

        {/* Eligibility Engine Output */}
        <div className={styles.eligibilitySection}>
          <h3 className={styles.sectionHeading}>Smart Eligibility Check</h3>
          
          <div className={styles.criteriaGrid}>
            <div className={styles.criteriaItem}>
              <span className={styles.criteriaTitle}>Min. CGPA</span>
              <span className={styles.criteriaValue}>{job.minimumCgpa}</span>
            </div>
            <div className={styles.criteriaItem}>
              <span className={styles.criteriaTitle}>Max Backlogs</span>
              <span className={styles.criteriaValue}>{job.maximumBacklogs}</span>
            </div>
            <div className={styles.criteriaItem}>
              <span className={styles.criteriaTitle}>Allowed Branches</span>
              <span className={styles.criteriaValue}>{job.allowedBranches.join(', ')}</span>
            </div>
          </div>

          {eligibility && (
            <div className={`${styles.eligibilityBanner} ${eligibility.isEligible ? styles.bannerSuccess : styles.bannerError}`}>
              <div className={styles.bannerIcon}>
                {eligibility.isEligible ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                  </svg>
                )}
              </div>
              <div className={styles.bannerContent}>
                <h4 className={styles.bannerTitle}>
                  {eligibility.isEligible ? "You are Eligible!" : "Not Eligible"}
                </h4>
                {eligibility.reasons.length > 0 && (
                  <ul className={styles.reasonsList}>
                    {eligibility.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}
        </div>

        <div className={`${profileStyles.actions} ${styles.marginTop32}`}>
          {eligibility?.isEligible ? (
            <Link href={`/dashboard/jobs/${job._id}/apply`} className={`btn btn-primary ${styles.fullWidthMobile}`}>
              Apply Now
            </Link>
          ) : (
            <button className={`btn btn-primary ${styles.fullWidthMobile}`} disabled>
              Cannot Apply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
