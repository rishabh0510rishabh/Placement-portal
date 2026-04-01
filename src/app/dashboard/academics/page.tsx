'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../profile/profile.module.css';

interface SemesterGPA {
  semester: number;
  gpa: number | '';
}

interface AcademicForm {
  semesters: SemesterGPA[];
  cgpa: number;
  activeBacklogs: number;
}

export default function AcademicsPage() {
  const router = useRouter();
  const [currentSemester, setCurrentSemester] = useState<number | null>(null);
  const [form, setForm] = useState<AcademicForm>({
    semesters: [],
    cgpa: 0,
    activeBacklogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchAcademics() {
      try {
        const res = await fetch('/api/profile/academics');
        const data = await res.json();
        if (res.ok) {
          const fetchedCurrentSem = data.currentSemester;
          setCurrentSemester(fetchedCurrentSem);
          
          let fetchedSemesters = data.academicDetails?.semesters || [];
          
          // Generate inputs up to current semester - 1 (or current if applicable)
          // The task says "Sem 1-7 depending on current semester", so max is 8.
          // Usually we enter GPA for completed semesters. We'll show up to currentSemester-1
          const completedSems = Math.max(0, fetchedCurrentSem - 1);
          
          const semestersArray = [];
          for (let i = 1; i <= completedSems; i++) {
            const existing = fetchedSemesters.find((s: SemesterGPA) => s.semester === i);
            semestersArray.push(existing ? existing : { semester: i, gpa: '' });
          }
          
          setForm({
            semesters: semestersArray,
            cgpa: data.academicDetails?.cgpa || 0,
            activeBacklogs: data.academicDetails?.activeBacklogs || 0,
          });
        } else {
          setError(data.error || 'Failed to fetch academic details');
        }
      } catch (err) {
        console.error('Failed to load academic details', err);
        setError('Failed to load academic profile');
      } finally {
        setLoading(false);
      }
    }
    fetchAcademics();
  }, []);

  const handleGpaChange = (semester: number, value: string) => {
    const min = 0;
    const max = 10;
    let newGpa: number | '' = value === '' ? '' : Number(value);
    
    if (typeof newGpa === 'number') {
      if (newGpa > max) newGpa = max;
      if (newGpa < min) newGpa = min;
    }

    setForm((prev) => {
      const updatedSemesters = prev.semesters.map((sem) => 
        sem.semester === semester ? { ...sem, gpa: newGpa } : sem
      );
      
      // Auto-calculate CGPA locally
      const validGpas = updatedSemesters.filter(s => typeof s.gpa === 'number' && s.gpa > 0);
      const totalGpa = validGpas.reduce((sum, s) => sum + Number(s.gpa), 0);
      const computedCgpa = validGpas.length > 0 ? Number((totalGpa / validGpas.length).toFixed(2)) : 0;

      return {
        ...prev,
        semesters: updatedSemesters,
        cgpa: computedCgpa,
      };
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    // Filter out semesters lacking a GPA input safely
    const submissionSemesters = form.semesters.map(s => ({
      ...s,
      gpa: Number(s.gpa) || 0
    }));

    try {
      const res = await fetch('/api/profile/academics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          semesters: submissionSemesters,
          activeBacklogs: Number(form.activeBacklogs) || 0,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save academic details.');
      } else {
        setSuccess('Academic details updated successfully!');
        setForm(prev => ({
          ...prev,
          cgpa: data.academicDetails.cgpa,
          activeBacklogs: data.academicDetails.activeBacklogs
        }));
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingWrapper}><span className="spinner" /> Loading academic details...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Academic Details</h1>
        <p className={styles.subtitle}>Manage your GPA and CGPA</p>
      </div>

      <div className={styles.card}>
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          
          <div className={styles.grid}>
            <div className={`form-group ${styles.fullWidth}`}>
              <div className={styles.statCard}>
                <div>
                  <h3 className={styles.statTitle}>Calculated CGPA</h3>
                  <p className={styles.statValue}>{form.cgpa.toFixed(2)}</p>
                </div>
                <div>
                  <label className={`form-label ${styles.statLabel}`} htmlFor="activeBacklogs">Active Backlogs</label>
                  <input
                    id="activeBacklogs"
                    name="activeBacklogs"
                    type="number"
                    min="0"
                    max="10"
                    className={`form-input ${styles.statInput}`}
                    value={form.activeBacklogs}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {form.semesters.length > 0 ? form.semesters.map((sem) => (
              <div key={sem.semester} className="form-group">
                <label className="form-label">Semester {sem.semester} GPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  className="form-input"
                  placeholder="e.g. 8.5"
                  value={sem.gpa}
                  onChange={(e) => handleGpaChange(sem.semester, e.target.value)}
                  required
                />
              </div>
            )) : (
              <div className={`form-group ${styles.emptyState}`}>
                No completed semesters to show based on your current semester ({currentSemester || 'unknown'}). 
                Please update your current semester in your basic profile if this is incorrect.
              </div>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving || form.semesters.length === 0}
            >
              {saving ? (
                <>
                  <span className={`spinner ${styles.spinnerSpace}`} />
                  Saving...
                </>
              ) : (
                'Save Academic Details'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
