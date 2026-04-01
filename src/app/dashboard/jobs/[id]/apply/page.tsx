'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './apply.module.css';
import profileStyles from '../../../profile/profile.module.css';

export default function ApplyJobPage() {
  const params = useParams();
  const router = useRouter();
  
  const [job, setJob] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!params || !params.id) return;
      try {
        // Fetch Job and Eligibility
        const jobRes = await fetch(`/api/jobs/${params.id}`);
        const jobData = await jobRes.json();
        
        // Fetch Profile for pre-fill
        const profileRes = await fetch('/api/profile');
        const profileData = await profileRes.json();

        if (jobRes.ok && profileRes.ok) {
          if (!jobData.eligibility?.isEligible) {
            setError('You are not eligible for this role.');
          } else if (!profileData.profile?.resume?.url) {
            setError('You must upload a resume before applying. Please go to Resumes section.');
          } else {
            setJob(jobData.job);
            setProfile(profileData.profile);
          }
        } else {
          setError('Failed to fetch required application data.');
        }
      } catch {
        setError('Network error occurred.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: params.id,
          resumeUrl: profile.resume.url,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSuccess(true);
      // Wait a moment and then redirect to jobs or a tracking page
      setTimeout(() => {
        router.push('/dashboard/jobs'); 
      }, 3000);

    } catch (err: any) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={profileStyles.loadingWrapper}>
        <span className="spinner" /> Preparing application...
      </div>
    );
  }

  if (error && !job) {
    return (
      <div className={profileStyles.container}>
        <div className="alert alert-error">{error}</div>
        <button onClick={() => router.push(`/dashboard/jobs/${params.id}`)} className={`btn btn-outline ${styles.mt16}`}>
          &larr; Back
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className={profileStyles.container}>
        <div className={profileStyles.card + ' ' + styles.centerSuccess}>
          <div className={styles.successIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2 className={styles.successTitle}>Application Submitted!</h2>
          <p className={styles.successText}>You have successfully applied for <strong>{job.role}</strong> at <strong>{job.companyName}</strong>.</p>
          <p className={styles.successSubtext}>Redirecting back to jobs portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.header}>
        <h1 className={profileStyles.title}>Confirm Application</h1>
        <p className={profileStyles.subtitle}>
          Review your pre-filled details before submitting your application to {job?.companyName}.
        </p>
      </div>

      <div className={profileStyles.card}>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit} className={styles.applyForm}>
          
          <div className={styles.summaryBox}>
            <h3 className={styles.boxTitle}>Role Details</h3>
            <p className={styles.summaryHighlight}>{job.role} @ {job.companyName}</p>
            <p className={styles.summarySub}>{job.location} | {job.salaryCtc}</p>
          </div>

          <div className={styles.studentDetailsGrid}>
            <div className={styles.detailField}>
              <label htmlFor="fullName">Full Name</label>
              <input id="fullName" type="text" className="form-input" value={profile.fullName} disabled aria-label="Full Name" />
            </div>
            <div className={styles.detailField}>
              <label htmlFor="rollNumber">Roll Number</label>
              <input id="rollNumber" type="text" className="form-input" value={profile.rollNumber} disabled aria-label="Roll Number" />
            </div>
            <div className={styles.detailField}>
              <label htmlFor="branch">Branch & Section</label>
              <input id="branch" type="text" className="form-input" value={`${profile.branch} - ${profile.section}`} disabled aria-label="Branch and Section" />
            </div>
            <div className={styles.detailField}>
              <label htmlFor="cgpa">Current CGPA</label>
              <input id="cgpa" type="text" className="form-input" value={profile.academicDetails?.cgpa || 'N/A'} disabled aria-label="Current CGPA" />
            </div>
          </div>

          <div className={styles.detailField}>
            <label>Key Skills Matching</label>
            <div className={styles.skillsBox}>
              {profile.skills?.programmingLanguages?.map((skill: string) => <span key={skill} className={styles.skillTag}>{skill}</span>)}
              {profile.skills?.frameworks?.map((skill: string) => <span key={skill} className={styles.skillTag}>{skill}</span>)}
              {(!profile.skills?.programmingLanguages?.length && !profile.skills?.frameworks?.length) && 
                <span className={styles.noData}>No specific skills highlighted.</span>
              }
            </div>
          </div>

          <div className={styles.resumeHighlight}>
            <label>Selected Resume</label>
            <div className={styles.resumeCard}>
              <div className={styles.resumeIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
              </div>
              <div className={styles.resumeNameBox}>
                <p className={styles.resumeFilename}>{profile.resume.filename}</p>
                <a href={profile.resume.url} target="_blank" rel="noopener noreferrer" className={styles.viewLink}>Preview PDF</a>
              </div>
            </div>
            <p className={styles.warningText}>Note: Your most recent resume upload will be sent.</p>
          </div>

          <div className={`${profileStyles.actions} ${styles.submitActions}`}>
            <button 
              type="button" 
              className="btn btn-ghost" 
              onClick={() => router.push(`/dashboard/jobs/${job._id}`)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={submitting || !!error}
            >
              {submitting ? (
                <>
                  <span className={`spinner ${styles.spinnerMargin}`} />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
