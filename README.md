# RKGIT Placement Portal

A centralized, professional web platform designed to streamline the placement process for students and placement coordinators at **Raj Kumar Goel Institute of Technology (RKGIT)**.

---

# Overview

The portal modernizes the recruitment experience with a premium **“Intellectual Atelier” design system**.

It enables:

* **Students** to manage their professional profiles and apply for job opportunities.
* **Placement administrators** to manage job postings, review applicants, and monitor recruitment progress efficiently.

The goal is to create a **single unified platform** that replaces manual placement coordination with a structured digital system.

---

# Key Features

## 🎓 Student Ecosystem

### Advanced Profile Management

Students can create detailed profiles including:

* Personal information
* Academic history
* Skills
* Projects
* Resume links

### Academic Tracking

* Semester-wise GPA entry
* Automatic **CGPA calculation**

### Smart Eligibility System

Automatically checks eligibility before application based on:

* CGPA requirements
* Branch restrictions
* Backlog conditions
* Required skills

### Resume Management

Students can upload or attach **multiple resumes** tailored to different job roles.

### Application Tracking

Students can track real-time status of their applications:

* Applied
* Shortlisted
* Selected
* Rejected

### Dashboard Alerts

Instant notifications for:

* New job postings
* Status updates
* Important placement announcements

---

# 🛡️ Administrative Suite

### Comprehensive Dashboard

Placement coordinators can monitor:

* Total registered students
* Active job postings
* Ongoing recruitment processes

### Student Management

Advanced search and filtering based on:

* Branch
* CGPA
* Skills
* Eligibility

### Job Posting & Management

Admins can:

* Create job postings
* Define eligibility criteria
* Manage application deadlines
* Edit or remove listings

### Applicant Review Workflow

Recruiters and admins can:

* View applicant lists
* Download resumes
* Update candidate statuses

### Data Export

Generate **server-side CSV reports** for:

* Applicant lists
* Recruitment statistics
* Placement data analysis

---

# 🔒 Security & Access Control

### Role-Based Access Control (RBAC)

Separate environments for:

* Students
* Administrators

### Domain Restricted Registration

Student registration is restricted to official email domain:

```
@rkgit.edu.in
```

### Secure Authentication

Implemented using:

* **NextAuth.js**
* **JWT Tokens**
* **BcryptJS Password Hashing**

---

# Tech Stack

### Frontend

* Next.js 16 (React 19)
* TypeScript

### Styling

* Vanilla CSS
* Custom **Intellectual Atelier Design System**

### Backend

* Node.js

### Database

* MongoDB (via Mongoose)

### Authentication

* NextAuth.js
* JWT

### Deployment

Optimized for:

* **Vercel**
* **Node.js Production Servers**

---

# Getting Started

## Prerequisites

* Node.js **18.x or higher**
* MongoDB instance (Local or MongoDB Atlas)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/rishabh0510rishabh/Placement-portal.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file and add:

```
MONGODB_URI=your_mongodb_uri
NEXTAUTH_SECRET=your_nextauth_secret
```

Add any additional environment variables required by the project.

---

### 4. Run Development Server

```bash
npm run dev
```

The application will run locally on:

```
http://localhost:3000
```

---

# Business Model & Infrastructure Documentation

Detailed documentation covering:

* Target Customers
* Revenue Model
* Cost Structure
* Infrastructure Strategy
* Handling 10K+ Students
* Competitor Analysis (including Superset)

📄 **Full Documentation:**
[https://drive.google.com/file/d/1zU2gab3v7nXcGdtdm6HmEuwVn0uU6OGF/view?usp=drive_link](https://drive.google.com/file/d/1zU2gab3v7nXcGdtdm6HmEuwVn0uU6OGF/view?usp=drive_link)

---

# Design Philosophy

This project uses the **Intellectual Atelier Design System**, inspired by editorial design and premium digital interfaces.

Key characteristics:

* Expansive **negative space**
* High-contrast **typography**
* **Glassmorphism-inspired UI elements**
* Smooth **micro-interactions**
* A refined and professional aesthetic suitable for **academic and corporate environments**

---
