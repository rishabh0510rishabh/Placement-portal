'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from '../../new/admin-jobs.module.css';
import profileStyles from '../../../../profile/profile.module.css';

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    description: '',
    minimumCgpa: '',
    allowedBranches: [] as string[],
    maximumBacklogs: '',
    salaryCtc: '',
    ctcBreakdown: '',
    location: '',
    deadline: '',
  });

  const allBranches = ['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE', 'MCA', 'MBA'];

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/jobs/${jobId}`);
        if (!res.ok) throw new Error('Failed to load job details');
        const data = await res.json();
        
        const d = new Date(data.job.applicationDeadline);
        const tzOffset = d.getTimezoneOffset() * 60000;
        const localISOTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);

        setFormData({
          companyName: data.job.companyName || '',
          role: data.job.role || '',
          description: data.job.description || '',
          minimumCgpa: data.job.minimumCgpa?.toString() || '0',
          allowedBranches: data.job.allowedBranches || [],
          maximumBacklogs: data.job.maximumBacklogs?.toString() || '0',
          salaryCtc: data.job.ctc || '',
          ctcBreakdown: data.job.ctcBreakdown || '',
          location: data.job.location || '',
          deadline: localISOTime,
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setFetching(false);
      }
    };

    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBranchToggle = (branch: string) => {
    setFormData((prev) => {
      const isSelected = prev.allowedBranches.includes(branch);
      if (isSelected) {
        return { ...prev, allowedBranches: prev.allowedBranches.filter((b) => b !== branch) };
      } else {
        return { ...prev, allowedBranches: [...prev.allowedBranches, branch] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.allowedBranches.length === 0) {
      setError('Please select at least one allowed branch.');
      setLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        ctc: formData.salaryCtc, // Convert field names from local form to DB schema
        minimumCgpa: parseFloat(formData.minimumCgpa),
        maximumBacklogs: parseInt(formData.maximumBacklogs, 10),
        applicationDeadline: new Date(formData.deadline).toISOString(),
      };

      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to update job posting');
      }

      setSuccess('Job posting updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/admin/jobs');
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="p-8 flex justify-center"><div className="spinner"></div></div>;
  }

  return (
    <div className={profileStyles.container}>
      <div className={profileStyles.header}>
        <h1 className={profileStyles.title}>Edit Job Posting</h1>
        <p className={profileStyles.subtitle}>
          Update placement opportunity details.
        </p>
      </div>

      <div className={profileStyles.card}>
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className={profileStyles.form}>
          <div className={profileStyles.grid}>
            
            <div className="form-group">
              <label className="form-label" htmlFor="companyName">Company Name</label>
              <input
                id="companyName"
                name="companyName"
                type="text"
                className="form-input"
                placeholder="e.g. Amazon"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="role">Role / Job Title</label>
              <input
                id="role"
                name="role"
                type="text"
                className="form-input"
                placeholder="e.g. SDE-1"
                value={formData.role}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="salaryCtc">Salary / CTC</label>
              <input
                id="salaryCtc"
                name="salaryCtc"
                type="text"
                className="form-input"
                placeholder="e.g. 15 LPA"
                value={formData.salaryCtc}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="ctcBreakdown">CTC Breakdown</label>
              <input
                id="ctcBreakdown"
                name="ctcBreakdown"
                type="text"
                className="form-input"
                placeholder="Base: 10L, Stocks: 3L, Bonus: 2L"
                value={formData.ctcBreakdown}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="minimumCgpa">Minimum CGPA Required</label>
              <input
                id="minimumCgpa"
                name="minimumCgpa"
                type="number"
                step="0.01"
                min="0"
                max="10"
                className="form-input"
                placeholder="e.g. 7.5"
                value={formData.minimumCgpa}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="maximumBacklogs">Maximum Active Backlogs</label>
              <input
                id="maximumBacklogs"
                name="maximumBacklogs"
                type="number"
                min="0"
                className="form-input"
                placeholder="e.g. 0"
                value={formData.maximumBacklogs}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="location">Job Location</label>
              <input
                id="location"
                name="location"
                type="text"
                className="form-input"
                placeholder="e.g. Bangalore, Gurugram"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="deadline">Application Deadline</label>
              <input
                id="deadline"
                name="deadline"
                type="datetime-local"
                className="form-input"
                value={formData.deadline}
                onChange={handleChange}
                required
              />
            </div>

            <div className={`form-group ${profileStyles.fullWidth}`}>
              <label className="form-label">Allowed Branches</label>
              <div className={styles.branchGrid}>
                {allBranches.map((branch) => (
                  <label key={branch} className={styles.branchCheckbox}>
                    <input
                      type="checkbox"
                      checked={formData.allowedBranches.includes(branch)}
                      onChange={() => handleBranchToggle(branch)}
                    />
                    <span>{branch}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={`form-group ${profileStyles.fullWidth}`}>
              <label className="form-label" htmlFor="description">Job Description</label>
              <textarea
                id="description"
                name="description"
                className={`form-input ${styles.textarea}`}
                rows={6}
                placeholder="Provide details about responsibilities, qualifications, and the interview process."
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className={`${profileStyles.actions} ${styles.actionRight}`}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? <span className={`spinner ${styles.spinnerMargin}`} /> : null}
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              className={`btn ${styles.cancelBtn}`}
              onClick={() => router.push('/dashboard/admin/jobs')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
