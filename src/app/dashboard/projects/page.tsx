'use client';

import { useState, useEffect } from 'react';
import styles from './projects.module.css';
import profileStyles from '../profile/profile.module.css';

interface Project {
  _id?: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [techInput, setTechInput] = useState<string>('');
  const [activeProjectIndex, setActiveProjectIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch('/api/profile/projects');
        const data = await res.json();
        if (res.ok) {
          setProjects(data.projects || []);
        } else {
          setError(data.error || 'Failed to load projects.');
        }
      } catch {
        setError('Failed to load projects.');
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  const handleAddProject = () => {
    setProjects([...projects, { title: '', description: '', technologies: [], githubLink: '' }]);
  };

  const handleRemoveProject = (index: number) => {
    const newProjects = [...projects];
    newProjects.splice(index, 1);
    setProjects(newProjects);
  };

  const handleChange = (index: number, field: keyof Project, value: string) => {
    const newProjects = [...projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setProjects(newProjects);
  };

  const handleAddTech = (index: number) => {
    if (!techInput.trim()) return;
    const newProjects = [...projects];
    if (!newProjects[index].technologies.includes(techInput.trim())) {
      newProjects[index].technologies.push(techInput.trim());
    }
    setProjects(newProjects);
    setTechInput('');
  };

  const handleRemoveTech = (projectIndex: number, techIndex: number) => {
    const newProjects = [...projects];
    newProjects[projectIndex].technologies.splice(techIndex, 1);
    setProjects(newProjects);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const res = await fetch('/api/profile/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projects }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to save projects.');
      } else {
        setSuccess('Projects saved successfully!');
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
        <span className="spinner" /> Loading projects...
      </div>
    );
  }

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.header}>
        <h1 className={profileStyles.title}>Projects</h1>
        <p className={profileStyles.subtitle}>
          Showcase your work &mdash; <strong className={styles.highlightText}>{projects.length}</strong> project{projects.length !== 1 ? 's' : ''} added
        </p>
      </div>

      <div className={profileStyles.card}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className={profileStyles.form}>
          <div className={styles.projectList}>
            {projects.map((project, index) => (
              <div key={index} className={styles.projectCard}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectTitle}>Project {index + 1}</h3>
                  <button
                    type="button"
                    className={`btn btn-ghost ${styles.removeProjectBtn}`}
                    onClick={() => handleRemoveProject(index)}
                  >
                    Remove
                  </button>
                </div>

                <div className={profileStyles.grid}>
                  <div className={`form-group ${profileStyles.fullWidth}`}>
                    <label className="form-label">Project Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Placement Portal"
                      value={project.title}
                      onChange={(e) => handleChange(index, 'title', e.target.value)}
                      required
                    />
                  </div>

                  <div className={`form-group ${profileStyles.fullWidth}`}>
                    <label className="form-label">Description</label>
                    <textarea
                      placeholder="Describe what you built, problems solved, and features."
                      value={project.description}
                      onChange={(e) => handleChange(index, 'description', e.target.value)}
                      rows={4}
                      required
                      className={`form-input ${styles.textareaFixed}`}
                    />
                  </div>

                  <div className={`form-group ${profileStyles.fullWidth}`}>
                    <label className="form-label">GitHub Link (Optional)</label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://github.com/username/repo"
                      value={project.githubLink || ''}
                      onChange={(e) => handleChange(index, 'githubLink', e.target.value)}
                    />
                  </div>

                  <div className={`form-group ${profileStyles.fullWidth}`}>
                    <label className="form-label">Technologies Used</label>
                    <div className={styles.techArea}>
                      {project.technologies.map((tech, tIndex) => (
                        <span key={tIndex} className={styles.techTag}>
                          {tech}
                          <button
                            type="button"
                            className={styles.techRemove}
                            onClick={() => handleRemoveTech(index, tIndex)}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                      
                      <div className={styles.techInputWrapper}>
                        <input
                          type="text"
                          className={`form-input ${styles.techInput}`}
                          placeholder="e.g. Next.js"
                          value={activeProjectIndex === index ? techInput : ''}
                          onChange={(e) => {
                            setActiveProjectIndex(index);
                            setTechInput(e.target.value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ',') {
                              e.preventDefault();
                              handleAddTech(index);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className={styles.addTechBtn}
                          onClick={() => handleAddTech(index)}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {projects.length === 0 && (
              <div className={styles.emptyState}>
                <p>No projects added yet.</p>
              </div>
            )}
          </div>

          <div className={`${profileStyles.actions} ${styles.actionsSpaced}`}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={handleAddProject}
            >
              + Add Another Project
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
                'Save Projects'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
