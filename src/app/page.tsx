'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import Modal from '@/components/Modal/Modal';

export default function Home() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register States
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const result = await signIn('credentials', {
        email: loginEmail,
        password: loginPassword,
        redirect: false,
      });

      if (result?.error) {
        setLoginError(result.error);
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch {
      setLoginError('An unexpected error occurred. Please try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regForm.name || !regForm.email || !regForm.password || !regForm.confirmPassword) {
      setRegError('All fields are required.');
      return;
    }

    if (!regForm.email.endsWith('@rkgit.edu.in')) {
      setRegError('Only @rkgit.edu.in email addresses are allowed.');
      return;
    }

    if (regForm.password.length < 8) {
      setRegError('Password must be at least 8 characters long.');
      return;
    }

    if (regForm.password !== regForm.confirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regForm.name, email: regForm.email, password: regForm.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setRegError(data.error || 'Registration failed. Please try again.');
      } else {
        setRegSuccess('Account created! Sign in to continue.');
        setTimeout(() => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(true);
        }, 1500);
      }
    } catch {
      setRegError('An unexpected error occurred. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="container" id="root-portal-view">
      <section className={styles.heroSection}>
        <div className={styles.glassGlow}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Elevating Careers at RKGIT</h1>
          <p className={styles.heroSubtitle}>
            A centralized recruitment ecosystem enabling the next generation of engineers 
            to connect with global opportunities through data-driven tracking.
          </p>
          <div className={styles.heroActions}>
            <button 
              onClick={() => setIsLoginModalOpen(true)} 
              className="btn btn-primary"
            >
              Sign In
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </button>
            <button 
              onClick={() => setIsRegisterModalOpen(true)} 
              className="btn btn-ghost"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Placement Analytics</h3>
            <p className={styles.featureText}>
              Comprehensive data visualization for institutional hiring velocity and salary trends.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Student Success Tracking</h3>
            <p className={styles.featureText}>
              Profile-first management engine supporting academic milestones and professional readiness.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-1.025m4.438 0a3.42 3.42 0 001.946 1.025m3.42 3.42c1.946 0 3.42 1.474 3.42 3.42m-13.68 0c0-1.946 1.474-3.42 3.42-3.42m3.42 3.42V7m6 7v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6m6-6a3.42 3.42 0 010 6.84m6-6.84a3.42 3.42 0 010 6.84" />
              </svg>
            </div>
            <h3 className={styles.featureTitle}>Smart Eligibility</h3>
            <p className={styles.featureText}>
              Automated screening mapping candidate CGPA, branch, and skillsets to company listings.
            </p>
          </div>
        </div>
      </section>

      {/* LOGIN MODAL */}
      <Modal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        title="Welcome Back"
      >
        <form onSubmit={handleLoginSubmit} className={styles.modalForm}>
          {loginError && <div className="alert alert-error">{loginError}</div>}
          <div className="form-group">
            <label className="form-label">College Email</label>
            <input 
              className="form-input" 
              type="email" 
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="you@rkgit.edu.in"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="form-input" 
              type="password" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="Enter password"
              required 
            />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.modalFullWidth}`} disabled={loginLoading}>
            {loginLoading ? <span className="spinner" /> : 'Sign In'}
          </button>
          <p className={styles.modalFooterText}>
            Don&apos;t have an account?
            <button 
              type="button" 
              onClick={() => { setIsLoginModalOpen(false); setIsRegisterModalOpen(true); }}
              className={styles.textLink}
            >
              Sign up
            </button>
          </p>
        </form>
      </Modal>

      {/* REGISTER MODAL */}
      <Modal 
        isOpen={isRegisterModalOpen} 
        onClose={() => setIsRegisterModalOpen(false)} 
        title="Create Account"
      >
        <form onSubmit={handleRegisterSubmit} className={styles.modalForm}>
          {regError && <div className="alert alert-error">{regError}</div>}
          {regSuccess && <div className="alert alert-success">{regSuccess}</div>}
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              className="form-input" 
              type="text" 
              value={regForm.name}
              onChange={(e) => setRegForm({...regForm, name: e.target.value})}
              placeholder="John Doe"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Student Email</label>
            <input 
              className="form-input" 
              type="email" 
              value={regForm.email}
              onChange={(e) => setRegForm({...regForm, email: e.target.value})}
              placeholder="you@rkgit.edu.in"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              className="form-input" 
              type="password" 
              value={regForm.password}
              onChange={(e) => setRegForm({...regForm, password: e.target.value})}
              placeholder="Min 8 characters"
              required 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input 
              className="form-input" 
              type="password" 
              value={regForm.confirmPassword}
              onChange={(e) => setRegForm({...regForm, confirmPassword: e.target.value})}
              placeholder="Repeat password"
              required 
            />
          </div>
          <button type="submit" className={`btn btn-primary ${styles.modalFullWidth}`} disabled={regLoading}>
            {regLoading ? <span className="spinner" /> : 'Create Account'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
