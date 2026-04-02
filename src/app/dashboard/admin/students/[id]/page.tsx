'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import styles from '../../../profile/profile.module.css';

interface ProfileData {
  user: any;
  profile: any;
}

export default function AdminStudentProfileView() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const studentId = params.id as string;

  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/dashboard');
    } else if (status === 'authenticated') {
      fetchStudentData();
    }
  }, [status, session, router]);

  const fetchStudentData = async () => {
    try {
      const res = await fetch(`/api/admin/students?id=${studentId}`);
      if (res.ok) {
        const result = await res.json();
        // Since the API returns a list by default, we expect the first result or a specific object if we tweaked it.
        // I'll adjust the API or handle the list. 
        setData(result.students?.[0] || null);
      } else {
        setError('Failed to load student profile.');
      }
    } catch (err) {
      setError('An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="spinner-container"><div className="spinner"></div></div>;
  }

  if (error || !data) {
    return <div className="alert alert-error">{error || 'Student not found.'}</div>;
  }

  const { user, profile } = data;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitleRow}>
          <button className="btn btn-outline" onClick={() => router.back()}>ΓåÉ Back</button>
          <h1 className={styles.title}>Student Profile View</h1>
        </div>
        <p className={styles.subtitle}>Viewing profile of {user.name} for administrative review (Task 14)</p>
      </header>

      <div className={styles.profileGrid}>
        {/* Left Col: Basics & Academic Summary */}
        <div className={styles.leftCol}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoField}>
                <label className={styles.label}>Roll Number</label>
                <div className={styles.value}>{profile?.rollNumber || '-'}</div>
              </div>
              <div className={styles.infoField}>
                <label className={styles.label}>Branch / Section</label>
                <div className={styles.value}>{profile?.branch} - {profile?.section}</div>
              </div>
              <div className={styles.infoField}>
                <label className={styles.label}>Email</label>
                <div className={styles.value}>{user.email}</div>
              </div>
              <div className={styles.infoField}>
                <label className={styles.label}>Placement Status</label>
                <div className={styles.value}>
                  <span className={`badge ${profile?.isPlaced ? 'badge-success' : 'badge-warning'}`}>
                    {profile?.isPlaced ? 'Placed' : 'Unplaced'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Academic Summary</h2>
            <div className={styles.infoField}>
              <label className={styles.label}>Current CGPA</label>
              <div className={styles.cgpaHighlight}>
                {profile?.academicDetails?.cgpa || 'N/A'}
              </div>
            </div>
            <div className={styles.infoField}>
              <label className={styles.label}>Active Backlogs</label>
              <div className={styles.value}>{profile?.academicDetails?.activeBacklogs ?? 0}</div>
            </div>
          </div>
        </div>

        {/* Right Col: Skills & Experience */}
        <div className={styles.rightCol}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Skills</h2>
            <div className={styles.skillsList}>
              {[
                ...(profile?.skills?.programmingLanguages || []),
                ...(profile?.skills?.frameworks || []),
                ...(profile?.skills?.tools || []),
                ...(profile?.skills?.technologies || [])
              ].map((skill: string, idx: number) => (
                <span key={idx} className={styles.skillBadge}>{skill}</span>
              ))}
            </div>
          </div>

          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Experience & Projects</h2>
            <p className={styles.subtitle}>Student has {profile?.experience?.length || 0} work experience items and {profile?.projects?.length || 0} projects listed.</p>
            {/* List first few items as summary */}
            <ul className={styles.projList}>
              {profile?.projects?.map((proj: any, idx: number) => (
                <li key={idx} className={styles.projItem}>ΓùÅ {proj.title}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.topMargin}`}>
        <h2 className={styles.sectionTitle}>Professional Links</h2>
        <div className={styles.linksList}>
          {profile?.professionalLinks?.linkedin && <a href={profile.professionalLinks.linkedin} target="_blank">LinkedIn</a>}
          {profile?.professionalLinks?.github && <a href={profile.professionalLinks.github} target="_blank">GitHub</a>}
          {profile?.professionalLinks?.portfolio && <a href={profile.professionalLinks.portfolio} target="_blank">Portfolio</a>}
        </div>
      </div>
    </div>
  );
}
