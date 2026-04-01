'use client';

import { useState, useEffect } from 'react';
import styles from './experience.module.css';
import profileStyles from '../profile/profile.module.css';

interface Experience {
  _id?: string;
  company: string;
  role: string;
  startDate: string; // ISO date string for input
  endDate?: string;  // ISO date string for input
  isCurrentRole: boolean;
  description: string;
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchExperience() {
      try {
        const res = await fetch('/api/profile/experience');
        const data = await res.json();
        if (res.ok && data.experience) {
          // Format dates to YYYY-MM for the input fields
          const formatted = data.experience.map((exp: any) => ({
            ...exp,
            startDate: exp.startDate ? new Date(exp.startDate).toISOString().slice(0, 7) : '',
            endDate: exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 7) : '',
          }));
          setExperiences(formatted);
        } else {
          setError(data.error || 'Failed to load experience.');
        }
      } catch {
        setError('Failed to load experience.');
      } finally {
        setLoading(false);
      }
    }
    fetchExperience();
  }, []);

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        isCurrentRole: false,
        description: '',
      },
    ]);
  };

  const handleRemoveExperience = (index: number) => {
    const newExps = [...experiences];
    newExps.splice(index, 1);
    setExperiences(newExps);
  };

  const handleChange = (index: number, field: keyof Experience, value: string | boolean) => {
    const newExps = [...experiences];
    newExps[index] = { ...newExps[index], [field]: value };

    // If setting to current role, clear end date
    if (field === 'isCurrentRole' && value === true) {
      newExps[index].endDate = '';
    }

    setExperiences(newExps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/profile/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ experience: experiences }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save experience.');
      } else {
        setSuccess('Experience saved successfully!');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={profileStyles.loadingWrapper}>
        <span className="spinner" /> Loading experience...
      </div>
    );
  }

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.header}>
        <h1 className={profileStyles.title}>Work Experience</h1>
        <p className={profileStyles.subtitle}>
          Add your internships, part-time, and full-time roles &mdash; <strong className={styles.highlightText}>{experiences.length}</strong> record{experiences.length !== 1 ? 's' : ''} added
        </p>
      </div>

      <div className={profileStyles.card}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className={profileStyles.form}>
          <div className={styles.list}>
            {experiences.map((exp, index) => (
              <div key={index} className={styles.expCard}>
                <div className={styles.expHeader}>
                  <h3 className={styles.expTitle}>Role {index + 1}</h3>
                  <button
                    type="button"
                    className={`btn btn-ghost ${styles.removeBtn}`}
                    onClick={() => handleRemoveExperience(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className={profileStyles.grid}>
                  <div className="form-group">
                    <label className="form-label" htmlFor={`company-${index}`}>Company Name</label>
                    <input
                      id={`company-${index}`}
                      type="text"
                      className="form-input"
                      placeholder="e.g. Google"
                      value={exp.company}
                      onChange={(e) => handleChange(index, 'company', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor={`role-${index}`}>Role/Designation</label>
                    <input
                      id={`role-${index}`}
                      type="text"
                      className="form-input"
                      placeholder="e.g. Software Engineer Intern"
                      value={exp.role}
                      onChange={(e) => handleChange(index, 'role', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor={`startDate-${index}`}>Start Date</label>
                    <input
                      id={`startDate-${index}`}
                      type="month"
                      placeholder="YYYY-MM"
                      title="Start date of employment"
                      className="form-input"
                      value={exp.startDate}
                      onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor={`endDate-${index}`}>End Date</label>
                    <input
                      id={`endDate-${index}`}
                      type="month"
                      placeholder="YYYY-MM"
                      title="End date of employment"
                      className={`form-input ${exp.isCurrentRole ? styles.disabledInput : ''}`}
                      value={exp.endDate || ''}
                      onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                      required={!exp.isCurrentRole}
                      disabled={exp.isCurrentRole}
                    />
                    <div className={styles.checkboxGroup}>
                      <input
                        type="checkbox"
                        id={`currentRole-${index}`}
                        checked={exp.isCurrentRole}
                        onChange={(e) => handleChange(index, 'isCurrentRole', e.target.checked)}
                      />
                      <label htmlFor={`currentRole-${index}`}>I currently work here</label>
                    </div>
                  </div>

                  <div className={`form-group ${profileStyles.fullWidth}`}>
                    <label className="form-label" htmlFor={`description-${index}`}>Description of Work</label>
                    <textarea
                      id={`description-${index}`}
                      placeholder="Describe your responsibilities, achievements, and impact."
                      value={exp.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      rows={4}
                      required
                      className={`form-input ${styles.textareaFixed}`}
                    />
                  </div>
                </div>
              </div>
            ))}

            {experiences.length === 0 && (
              <div className={styles.emptyState}>
                <p>No experience added yet. Click &quot;Add Experience&quot; to begin.</p>
              </div>
            )}
          </div>

          <div className={`${profileStyles.actions} ${styles.actionsSpaced}`}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleAddExperience}
            >
              + Add Experience
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className={`spinner ${styles.spinnerMargin}`} />
                  Saving...
                </>
              ) : (
                'Save Experience'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
