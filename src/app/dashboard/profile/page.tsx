'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';

interface ProfileForm {
  fullName: string;
  rollNumber: string;
  collegeId: string;
  branch: string;
  section: string;
  phoneNumber: string;
  email: string;
  currentSemester: number | '';
}

export default function ProfilePage() {
  const router = useRouter();
  const [form, setForm] = useState<ProfileForm>({
    fullName: '',
    rollNumber: '',
    collegeId: '',
    branch: 'CSE',
    section: '',
    phoneNumber: '',
    email: '',
    currentSemester: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setForm(data.profile);
          }
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          currentSemester: Number(form.currentSemester),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save profile.');
      } else {
        setSuccess('Profile updated successfully!');
        router.refresh();
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loadingWrapper}><span className="spinner" /> Loading profile...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Student Profile</h1>
        <p className={styles.subtitle}>Manage your basic details</p>
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
            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="john@rkgit.edu.in"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                className="form-input"
                placeholder="10-digit mobile number"
                value={form.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="rollNumber">Roll Number</label>
              <input
                id="rollNumber"
                name="rollNumber"
                type="text"
                className="form-input"
                placeholder="e.g. 2100320100001"
                value={form.rollNumber}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="collegeId">College ID / Admission No</label>
              <input
                id="collegeId"
                name="collegeId"
                type="text"
                className="form-input"
                placeholder="e.g. 2021BTECS001"
                value={form.collegeId}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="branch">Branch</label>
              <select
                id="branch"
                name="branch"
                className={`form-input ${styles.select}`}
                value={form.branch}
                onChange={handleChange}
                required
              >
                <option value="CSE">CSE</option>
                <option value="CSE-AI">CSE-AI</option>
                <option value="CSE-DS">CSE-DS</option>
                <option value="ECE">ECE</option>
                <option value="EE">EE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="IT">IT</option>
                <option value="EN">EN</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="section">Section</label>
              <input
                id="section"
                name="section"
                type="text"
                className="form-input"
                placeholder="e.g. A, B, C"
                value={form.section}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="currentSemester">Current Semester</label>
              <select
                id="currentSemester"
                name="currentSemester"
                className={`form-input ${styles.select}`}
                value={form.currentSemester}
                onChange={handleChange}
                required
              >
                <option value="" disabled>Select Semester</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                  <option key={sem} value={sem}>Semester {sem}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.actions}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner" style={{marginRight: '8px'}} />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
