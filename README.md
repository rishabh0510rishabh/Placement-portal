# RKGIT Placement Portal

A centralized, professional web platform designed to streamline the placement process for students and placement coordinators at Raj Kumar Goel Institute of Technology (RKGIT).

## Overview
The portal modernizes the recruitment experience, featuring a high-end "Intellectual Atelier" design system. It allows students to manage their professional identity and apply for jobs, while providing administrators with a powerful suite of management and tracking tools.

## Key Features

### 🎓 Student Ecosystem
- **Advanced Profile Management**: Detailed profiles including personal details, academic history, skills, and projects.
- **Academic Tracking**: Semester-wise GPA input with automatic CGPA calculation.
- **Smart Eligibility System**: Automatically checks student eligibility based on CGPA, branch, backlogs, and skills before allowing applications.
- **Resume Management**: Support for multiple professional resumes/links for different job roles.
- **Application Tracking**: Real-time monitoring of application status (Applied, Shortlisted, Selected, Rejected).
- **Dashboard Alerts**: Instant notifications for new job postings and status updates.

### 🛡️ Administrative Suite
- **Comprehensive Dashboard**: Real-time metrics on total students, active job postings, and recruitment progress.
- **Student Management**: Advanced search and filtering tools to review student profiles by branch, CGPA, or skills.
- **Job Posting & Management**: Create, edit, and target job postings with specific eligibility criteria.
- **Applicant Review Workflow**: Streamlined interface to manage applicant lists, download resumes, and update recruitment statuses.
- **Data Export**: Generate server-side CSV reports for applicants and recruitment statistics.

### 🔒 Security & Access Control
- **Role-Based Access Control (RBAC)**: Secure separation between Student and Admin environments.
- **Domain-Restricted Registration**: Student sign-ups are restricted to official `@rkgit.edu.in` emails.
- **Secure Authentication**: Implementation using NextAuth.js, JWT tokens, and BcryptJS password hashing.

## Tech Stack
- **Frontend**: [Next.js 16](https://nextjs.org/) (React 19), TypeScript
- **Styling**: Vanilla CSS (Tailored Design System)
- **Backend & Database**: Node.js, [Mongoose](https://mongoosejs.com/) (MongoDB)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/), JWT
- **Deployment**: Optimized for production environments (Vercel/Node.js)

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- MongoDB instance (Local or Atlas)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/rishabh0510rishabh/Placement-portal.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables in `.env.local`:
   ```env
   MONGODB_URI=your_mongodb_uri
   NEXTAUTH_SECRET=your_nextauth_secret
   # Add other required environment variables
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Design Philosophy
This project utilizes the **Intellectual Atelier** design system—a sophisticated, editorial-inspired UI characterized by:
- Expansive negative space and tonal layering.
- High-contrast typography for readability.
- Subtle glassmorphism and modern micro-interactions.
- A premium, professional aesthetic tailored for an academic and corporate environment.

---

Built with ❤️ for RKGIT placement success.
