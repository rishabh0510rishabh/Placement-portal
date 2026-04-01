'use client';

import { useState, useEffect } from 'react';
import styles from './links.module.css';
import profileStyles from '../profile/profile.module.css';

interface Links {
  linkedin: string;
  github: string;
  portfolio: string;
  leetcode: string;
}

export default function LinksPage() {
  const [links, setLinks] = useState<Links>({
    linkedin: '',
    github: '',
    portfolio: '',
    leetcode: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch('/api/profile/links');
        const data = await res.json();
        if (res.ok && data.links) {
          setLinks({
            linkedin: data.links.linkedin || '',
            github: data.links.github || '',
            portfolio: data.links.portfolio || '',
            leetcode: data.links.leetcode || '',
          });
        } else {
          setError(data.error || 'Failed to load links.');
        }
      } catch {
        setError('Failed to load links.');
      } finally {
        setLoading(false);
      }
    }
    fetchLinks();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLinks((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/profile/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ links }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save links.');
      } else {
        setSuccess('Professional links saved successfully!');
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
        <span className="spinner" /> Loading professional links...
      </div>
    );
  }

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.header}>
        <h1 className={profileStyles.title}>Professional Links</h1>
        <p className={profileStyles.subtitle}>
          Connect your profiles to give recruiters a complete picture.
        </p>
      </div>

      <div className={profileStyles.card}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className={styles.formContainer}>
          
          <div className={styles.inputWrapper}>
            <label className="form-label" htmlFor="linkedin">LinkedIn Profile URL</label>
            <div className={styles.inputGroup}>
              <span className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </span>
              <input
                id="linkedin"
                name="linkedin"
                type="url"
                className={`form-input ${styles.inputWithIcon}`}
                placeholder="https://linkedin.com/in/username"
                value={links.linkedin}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label className="form-label" htmlFor="github">GitHub Profile URL</label>
            <div className={styles.inputGroup}>
              <span className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </span>
              <input
                id="github"
                name="github"
                type="url"
                className={`form-input ${styles.inputWithIcon}`}
                placeholder="https://github.com/username"
                value={links.github}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label className="form-label" htmlFor="leetcode">LeetCode Profile URL</label>
            <div className={styles.inputGroup}>
              <span className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.105 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.939 5.939 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.004-1.95v-.002c-.537-.537-1.407-.537-1.944-.002l-2.395 2.391a2.898 2.898 0 0 1-4.09 0l-4.27-4.186a2.91 2.91 0 0 1-.571-.871 2.802 2.802 0 0 1-.26-1.129 2.76 2.76 0 0 1 .863-1.967l3.829-4.098 5.405-5.786a1.36 1.36 0 0 0 0-1.942L14.471.438A1.37 1.37 0 0 0 13.483 0zm4.18 13.911a1.442 1.442 0 0 0-1.011.413 1.433 1.433 0 1 0 1.424 1.016v-.004a1.434 1.434 0 0 0-.413-1.425zm-6.191-2.029a1.432 1.432 0 1 0 0 2.862 1.432 1.432 0 0 0 0-2.862zm-3.64-3.64a1.432 1.432 0 1 0 0 2.862 1.432 1.432 0 0 0 0-2.862z"/>
                </svg>
              </span>
              <input
                id="leetcode"
                name="leetcode"
                type="url"
                className={`form-input ${styles.inputWithIcon}`}
                placeholder="https://leetcode.com/username"
                value={links.leetcode}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={styles.inputWrapper}>
            <label className="form-label" htmlFor="portfolio">Personal Portfolio Website</label>
            <div className={styles.inputGroup}>
              <span className={styles.iconWrapper}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </span>
              <input
                id="portfolio"
                name="portfolio"
                type="url"
                className={`form-input ${styles.inputWithIcon}`}
                placeholder="https://yourwebsite.com"
                value={links.portfolio}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className={`${profileStyles.actions} ${styles.actionsWrapper}`}>
            <button
              type="submit"
              className={`btn btn-primary ${styles.fullWidthBtn}`}
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className={`spinner ${styles.spinnerMargin}`} />
                  Saving Links...
                </>
              ) : (
                'Save Professional Links'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
