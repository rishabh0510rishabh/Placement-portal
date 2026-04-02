'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './students.module.css';

interface Student {
  _id: string;
  name: string;
  email: string;
  profile?: {
    rollNumber: string;
    branch: string;
    section: string;
    academicDetails?: {
      cgpa: number;
    };
  };
}

export default function StudentManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters
  const [search, setSearch] = useState('');
  const [branch, setBranch] = useState('');
  const [minCgpa, setMinCgpa] = useState('');

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (branch) query.append('branch', branch);
      if (minCgpa) query.append('minCgpa', minCgpa);
      
      const res = await fetch(`/api/admin/students?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch students');
      
      const data = await res.json();
      setStudents(data.students);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, branch, minCgpa]);

  useEffect(() => {
    if (status === 'unauthenticated' || (session?.user as any)?.role !== 'admin') {
      router.push('/dashboard');
    } else if (status === 'authenticated') {
      fetchStudents();
    }
  }, [status, session, router, fetchStudents]);

  const handleResetFilters = () => {
    setSearch('');
    setBranch('');
    setMinCgpa('');
  };

  if (status === 'loading') {
    return (
      <div className={styles.loadingContainer}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Student Management</h1>
        <p className={styles.subtitle}>View, search, and manage all registered students</p>
      </header>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className={styles.filtersContainer}>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Search By Name / Email / Roll No</label>
          <input
            type="text"
            className={styles.filterInput}
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Filter by Branch</label>
          <select 
            className={styles.filterSelect}
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="">All Branches</option>
            <option value="CSE">Computer Science (CSE)</option>
            <option value="IT">Information Technology (IT)</option>
            <option value="ECE">Electronics (ECE)</option>
            <option value="ME">Mechanical (ME)</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>Minimum CGPA</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.1"
            className={styles.filterInput}
            placeholder="e.g. 7.5"
            value={minCgpa}
            onChange={(e) => setMinCgpa(e.target.value)}
          />
        </div>

        <button className={styles.resetButton} onClick={handleResetFilters}>
          Reset Filters
        </button>
      </div>

      <div className={styles.studentsList}>
        {loading ? (
          <div className="p-8 flex justify-center"><div className="spinner"></div></div>
        ) : students.length === 0 ? (
          <div className={styles.emptyState}>
            No students found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={styles.studentTable}>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Branch & Section</th>
                  <th>CGPA</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student._id}>
                    <td>
                      <div className={styles.studentName}>{student.name}</div>
                      <div className={styles.studentEmail}>{student.email}</div>
                    </td>
                    <td>{student.profile?.rollNumber || '-'}</td>
                    <td>
                      {student.profile?.branch ? (
                        <span className={styles.branchBadge}>
                          {student.profile.branch} - {student.profile.section}
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      {student.profile?.academicDetails?.cgpa ? (
                        <span className={styles.cgpaBadge}>
                          {student.profile.academicDetails.cgpa.toFixed(2)}
                        </span>
                      ) : '-'}
                    </td>
                    <td>
                      <button 
                        className={styles.viewProfileBtn}
                        onClick={() => alert('View Profile implementation pending for Task 14/16')}
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
