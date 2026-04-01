'use client';

import { useState, useEffect, KeyboardEvent } from 'react';
import styles from './skills.module.css';
import profileStyles from '../profile/profile.module.css';

/* ─── types ─────────────────────────────────────────────────── */
type CategoryKey =
  | 'programmingLanguages'
  | 'frameworks'
  | 'tools'
  | 'databases'
  | 'technologies';

interface SkillsState {
  programmingLanguages: string[];
  frameworks: string[];
  tools: string[];
  databases: string[];
  technologies: string[];
}

/* ─── category meta ──────────────────────────────────────────── */
const CATEGORIES: { key: CategoryKey; label: string; placeholder: string; mod: string }[] = [
  {
    key: 'programmingLanguages',
    label: 'Programming Languages',
    placeholder: 'e.g. Python, Java, C++',
    mod: 'indigo',
  },
  {
    key: 'frameworks',
    label: 'Frameworks',
    placeholder: 'e.g. React, Next.js, Spring',
    mod: 'cyan',
  },
  {
    key: 'tools',
    label: 'Tools',
    placeholder: 'e.g. Git, Docker, Figma',
    mod: 'amber',
  },
  {
    key: 'databases',
    label: 'Databases',
    placeholder: 'e.g. MongoDB, PostgreSQL, Redis',
    mod: 'emerald',
  },
  {
    key: 'technologies',
    label: 'Technologies',
    placeholder: 'e.g. REST APIs, GraphQL, WebSockets',
    mod: 'violet',
  },
];

const EMPTY: SkillsState = {
  programmingLanguages: [],
  frameworks: [],
  tools: [],
  databases: [],
  technologies: [],
};

/* ─── component ──────────────────────────────────────────────── */
export default function SkillsPage() {
  const [skills, setSkills] = useState<SkillsState>(EMPTY);
  const [inputs, setInputs] = useState<Record<CategoryKey, string>>({
    programmingLanguages: '',
    frameworks: '',
    tools: '',
    databases: '',
    technologies: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  /* fetch existing skills */
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/profile/skills');
        const data = await res.json();
        if (res.ok) {
          setSkills({ ...EMPTY, ...data.skills });
        } else {
          setError(data.error || 'Failed to load skills.');
        }
      } catch {
        setError('Failed to load skills.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* add a tag via Enter or comma */
  const handleKeyDown = (cat: CategoryKey, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(cat);
    }
  };

  const addTag = (cat: CategoryKey) => {
    const raw = inputs[cat].trim().replace(/,+$/, '');
    if (!raw) return;
    if (skills[cat].includes(raw)) {
      setInputs((p) => ({ ...p, [cat]: '' }));
      return;
    }
    setSkills((p) => ({ ...p, [cat]: [...p[cat], raw] }));
    setInputs((p) => ({ ...p, [cat]: '' }));
  };

  const removeTag = (cat: CategoryKey, tag: string) => {
    setSkills((p) => ({ ...p, [cat]: p[cat].filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/profile/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to save skills.');
      } else {
        setSuccess('Skills saved successfully!');
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
        <span className="spinner" /> Loading skills...
      </div>
    );
  }

  const totalSkills = Object.values(skills).reduce((n, arr) => n + arr.length, 0);

  return (
    <div className={profileStyles.container}>
      {/* header */}
      <div className={profileStyles.header}>
        <h1 className={profileStyles.title}>Skills</h1>
        <p className={profileStyles.subtitle}>
          Add your technical skills across each category &mdash;{' '}
          <strong className={styles.totalHighlight}>{totalSkills}</strong> skill
          {totalSkills !== 1 ? 's' : ''} added
        </p>
      </div>

      <div className={profileStyles.card}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className={profileStyles.form}>
          <div className={styles.categories}>
            {CATEGORIES.map((cat) => (
              <div key={cat.key} className={styles.categoryBlock}>
                {/* category header */}
                <div className={styles.categoryHeader}>
                  <span
                    className={`${styles.categoryDot} ${styles[`dot_${cat.mod}`]}`}
                  />
                  <span className={styles.categoryLabel}>{cat.label}</span>
                  <span className={styles.categoryCount}>
                    {skills[cat.key].length}
                  </span>
                </div>

                {/* tag pills */}
                <div className={styles.tagArea}>
                  {skills[cat.key].map((tag) => (
                    <span
                      key={tag}
                      className={`${styles.tag} ${styles[`tag_${cat.mod}`]}`}
                    >
                      {tag}
                      <button
                        type="button"
                        className={styles.tagRemove}
                        onClick={() => removeTag(cat.key, tag)}
                        aria-label={`Remove ${tag}`}
                      >
                        ×
                      </button>
                    </span>
                  ))}

                  {/* inline input */}
                  <div className={styles.inputWrapper}>
                    <input
                      type="text"
                      className={styles.tagInput}
                      placeholder={cat.placeholder}
                      value={inputs[cat.key]}
                      onChange={(e) =>
                        setInputs((p) => ({ ...p, [cat.key]: e.target.value }))
                      }
                      onKeyDown={(e) => handleKeyDown(cat.key, e)}
                      onBlur={() => addTag(cat.key)}
                    />
                    <button
                      type="button"
                      className={styles.addBtn}
                      onClick={() => addTag(cat.key)}
                      aria-label={`Add to ${cat.label}`}
                    >
                      +
                    </button>
                  </div>
                </div>

                <p className={styles.hint}>
                  Press <kbd>Enter</kbd> or <kbd>,</kbd> to add · click × to remove
                </p>
              </div>
            ))}
          </div>

          <div className={profileStyles.actions}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
            >
              {saving ? (
                <>
                  <span className="spinner" />
                  Saving...
                </>
              ) : (
                'Save Skills'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
