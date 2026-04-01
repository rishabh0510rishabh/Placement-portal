'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './resumes.module.css';
import profileStyles from '../profile/profile.module.css';

interface ResumeData {
  filename: string;
  url: string;
  uploadedAt: string;
}

export default function ResumesPage() {
  const [resume, setResume] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchResume() {
      try {
        const res = await fetch('/api/profile/resume');
        const data = await res.json();
        if (res.ok) {
          setResume(data.resume || null);
        } else {
          setError(data.error || 'Failed to load resume data.');
        }
      } catch {
        setError('Failed to load resume data.');
      } finally {
        setLoading(false);
      }
    }
    fetchResume();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setSuccess('');
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validation
      if (file.type !== 'application/pdf') {
        setError('Please select a valid PDF file.');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('File size exceeds the 5MB limit.');
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }

    setError('');
    setSuccess('');
    setUploading(true);

    const formData = new FormData();
    formData.append('resume', selectedFile);

    try {
      const res = await fetch('/api/profile/resume', {
        method: 'POST',
        body: formData, // the browser automatically sets Content-Type to multipart/form-data
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to upload resume.');
      } else {
        setSuccess('Resume uploaded successfully!');
        setResume(data.resume);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch {
      setError('An unexpected error occurred during upload. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  if (loading) {
    return (
      <div className={profileStyles.loadingWrapper}>
        <span className="spinner" /> Loading resume data...
      </div>
    );
  }

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.header}>
        <h1 className={profileStyles.title}>Resume Upload</h1>
        <p className={profileStyles.subtitle}>
          Upload your latest ATS-friendly resume to apply for campus placements.
        </p>
      </div>

      <div className={profileStyles.card}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className={styles.contentArea}>
          
          {/* Current Resume Display */}
          {resume ? (
            <div className={styles.currentResumeBox}>
              <div className={styles.resumeInfo}>
                <div className={styles.fileIcon}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                </div>
                <div className={styles.fileDetails}>
                  <h3 className={styles.filename}>{resume.filename}</h3>
                  <p className={styles.uploadDate}>
                    Uploaded on {new Date(resume.uploadedAt).toLocaleDateString()} at {new Date(resume.uploadedAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className={styles.resumeActions}>
                <a href={resume.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                  View PDF
                </a>
              </div>
            </div>
          ) : (
            <div className={styles.noResumeState}>
              <p>No resume uploaded yet.</p>
            </div>
          )}

          <div className={profileStyles.divider} />

          {/* Upload Section */}
          <form onSubmit={handleUpload} className={styles.uploadForm}>
            <h3 className={styles.sectionTitle}>
              {resume ? 'Update Resume' : 'Upload New Resume'}
            </h3>
            
            <div 
              className={`${styles.uploadDropzone} ${selectedFile ? styles.fileSelected : ''}`}
              onClick={triggerFileInput}
            >
              <input
                id="resumeUpload"
                title="Upload Resume PDF"
                aria-label="Upload Resume PDF"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className={styles.hiddenInput}
              />
              
              <div className={styles.dropzoneContent}>
                <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                
                {selectedFile ? (
                  <div className={styles.selectedFileDisplay}>
                    <p className={styles.selectedName}>{selectedFile.name}</p>
                    <p className={styles.selectedSize}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <div className={styles.uploadTextPrompt}>
                    <p className={styles.primaryText}>
                      <span className={styles.browseLink}>Click to browse</span> or drag and drop
                    </p>
                    <p className={styles.secondaryText}>PDF only (max 5MB)</p>
                  </div>
                )}
              </div>
            </div>

            <div className={`${profileStyles.actions} ${styles.actionRight}`}>
              {selectedFile && (
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setSelectedFile(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                    setError('');
                  }}
                  disabled={uploading}
                >
                  Cancel
                </button>
              )}
              
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!selectedFile || uploading}
              >
                {uploading ? (
                  <>
                    <span className={`spinner ${styles.spinnerMargin}`} />
                    Uploading...
                  </>
                ) : (
                  'Upload Document'
                )}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
