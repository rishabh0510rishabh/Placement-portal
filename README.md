# 🏛️ RKGIT Placement Portal

### **The Digital Backbone of Institutional Recruitment**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge\&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge\&logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge\&logo=supabase\&logoColor=white)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge\&logo=docker\&logoColor=white)](https://www.docker.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green?style=for-the-badge\&logo=vercel)](https://rkgitplacements.vercel.app/)
[![Documentation](https://img.shields.io/badge/Documentation-blue?style=for-the-badge\&logo=google-drive)](https://drive.google.com/file/d/1zU2gab3v7nXcGdtdm6HmEuwVn0uU6OGF/view)

A centralized, professional web ecosystem designed to transform the placement landscape for students and coordinators at **Raj Kumar Goel Institute of Technology (RKGIT)**.

---

# 🌟 Vision

The portal replaces fragmented and manual placement coordination with a **unified, data-driven digital platform**.

Built with a modern system architecture and the **"Intellectual Atelier" design system**, the platform delivers a high-performance and editorial-style interface that reflects the professionalism of modern corporate environments.

---

# 🌐 Live Prototype

Experience the working version of the portal:

🔗 **Live Portal**
https://rkgitplacements.vercel.app/

The prototype demonstrates the complete workflow including:

* Student Dashboard
* Admin Panel
* Job Listings
* Eligibility Engine
* Application Tracking

---

# 🔥 Key Competitive Advantages

## 🎓 For Students: The Career Command Center

* **Intelligent Eligibility Engine**
  Automatically verifies eligibility based on CGPA, branch, and backlog criteria.

* **High-Fidelity Student Profiles**
  Academic tracking, resume management, and profile-based applications.

* **Live Job Discovery Engine**
  Instantly explore opportunities and verify compatibility.

* **Application Dashboard**
  Track applications, updates, and deadlines in a clean interface.

---

## 🛡️ For Administrators: The Recruitment Nexus

* **Real-Time System Telemetry**
  Track student activity and placement statistics.

* **Advanced Student Filtering**
  Filter students by branch, CGPA, and eligibility conditions.

* **Bulk Data Management**
  Efficient student data handling with **CSV export functionality**.

* **Pipeline Control**
  Post jobs, manage deadlines, and track applicants in real time.

---

# ⚡ Technical Excellence & Performance

We built the platform with a focus on **performance, scalability, and reliability**.

* **Ultra-Low Latency APIs**
  Optimized backend queries using concurrent execution (`Promise.all`).

* **Premium User Experience**
  Skeleton loaders and smooth UI transitions prevent flicker.

* **Telemetry Monitoring**
  Integrated **Vercel Analytics** and **Speed Insights**.

* **Secure Authentication**
  Role-based access with **domain-restricted registration** (@rkgit.edu.in).

---

# 🛠️ Tech Stack

| Layer              | Technology                                       |
| ------------------ | ------------------------------------------------ |
| **Framework**      | Next.js 16 (React 19) + TypeScript               |
| **Database**       | Supabase (PostgreSQL)                            |
| **Authentication** | NextAuth.js + JWT + Argon2/Bcrypt                |
| **Styling**        | Vanilla CSS + Intellectual Atelier Design System |
| **Monitoring**     | Vercel Analytics + Speed Insights                |
| **Deployment**     | Docker + Vercel Standalone                       |

---

# 📑 Business Model & Infrastructure Documentation

A detailed document explaining the **business model, infrastructure strategy, scalability plan, and long-term vision** of the placement portal.

📄 **View Documentation**
https://drive.google.com/file/d/1zU2gab3v7nXcGdtdm6HmEuwVn0uU6OGF/view?usp=drive_link

---

# 🚀 Deployment & Setup

## 🐋 Docker Installation (Recommended)

The fastest way to run the production-ready portal.

### 1️⃣ Clone Repository

```bash
git clone https://github.com/rishabh0510rishabh/Placement-portal.git
cd Placement-portal
```

### 2️⃣ Environment Setup

Create `.env.local` and add required secrets.

### 3️⃣ Build and Run

```bash
docker build -t placement-portal .
docker run -p 3000:3000 placement-portal
```

Access the portal at:

```
http://localhost:3000
```

---

## 💻 Manual Setup

### Install Dependencies

```bash
npm install
```

### Configure Environment

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

### Start Development Server

```bash
npm run dev
```

---

# 🎨 Design Philosophy — "Intellectual Atelier"

The design moves away from generic admin dashboards and focuses on **clarity, structure, and professional aesthetics**.

Key design principles:

* **Negative Space** for readability
* **Tonal Layering** using subtle shadows and glass effects
* **Typography-Driven Interface** for strong visual hierarchy
* **Smooth Micro-Interactions** for a premium user experience

---

# 📈 Scalability Vision

The architecture is designed to support **10,000+ students and large placement drives** with optimized database queries and scalable deployment infrastructure.

Future improvements include:

* AI-based resume scoring
* recruiter company portal
* analytics-driven placement insights
* automated student shortlisting

---

© 2026 **RKGIT Placement Portal Development Team**
