# 🏛️ RKGIT Placement Portal
### **The Digital Backbone of Institutional Recruitment**

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

A centralized, professional web ecosystem designed to transform the placement landscape for students and coordinators at **Raj Kumar Goel Institute of Technology (RKGIT)**.

---

## 🌟 Vision
The portal replaces fragmented, manual coordination with a unified, data-driven platform. Built on the **"Intellectual Atelier"** design system, it delivers a high-performance, editorial-style interface that mirrors the professionalism of elite corporate environments.

---

## 🔥 Key Competitive Advantages

### 🎓 For Students: The Career Command Center
*   **Intelligent Eligibility Engine**: Real-time validation against CGPA, Branch, and Backlog rules. Never waste time on ineligible applications.
*   **High-Fidelity Profiles**: Comprehensive academic tracking with automatic CGPA calculations and multi-resume management.
*   **Live Discovery Engine**: Deep-search job listings with instant compatibility feedback.
*   **Telemetric Dashboard**: Beautifully prioritized activity feeds and application tracking.

### 🛡️ For Administrators: The Recruitment Nexus
*   **System Telemetry**: Real-time metrics on student engagement and company demand pipelines.
*   **Zero-Effort Management**: Advanced student filtering, bulk actions, and server-side **CSV data extraction**.
*   **Active Pipeline Control**: Instant job posting, deadline management, and candidate status orchestration.

---

## ⚡ Technical Excellence & Performance
We didn't just build a portal; we built a high-performance machine:

- **Ultra-Low Latency**: Optimized API layers using concurrent database queries (`Promise.all`) and selective column fetching.
- **Premium UX**: High-fidelity **Skeleton Loaders** and custom **Synchronizing Screens** ensure a smooth, "no-flicker" experience even on slower networks.
- **Vercel Telemetry**: Integrated **Speed Insights** and **Analytics** for continuous performance monitoring.
- **Robust Security**: Role-Based Access Control (RBAC) with domain-restricted registration (@rkgit.edu.in).

---

## 🛠️ Tech Stack
| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (React 19) + TypeScript |
| **Database** | Supabase (PostgreSQL) |
| **Auth** | NextAuth.js + JWT + Argon2/Bcrypt |
| **Styling** | Vanilla CSS + Intellectual Atelier Design System |
| **Monitoring** | Vercel Analytics + Speed Insights |
| **Deployment** | Docker + Vercel Standalone |

---

## 🚀 Deployment & Setup

### 🐋 Docker Installation (Recommended)
The fastest way to get the production-ready portal running:

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/rishabh0510rishabh/Placement-portal.git
    cd Placement-portal
    ```
2.  **Environment Setup**
    Ensure your `.env.local` contains your Supabase and NextAuth secrets.
3.  **Build and Run**
    ```bash
    docker build -t placement-portal .
    docker run -p 3000:3000 placement-portal
    ```
    *Access the portal at `http://localhost:3000`.*

### 💻 Manual Setup
1.  **Install dependencies**
    ```bash
    npm install
    ```
2.  **Configure `.env.local`**
    ```env
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_secret
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
    ```
3.  **Launch Dev**
    ```bash
    npm run dev
    ```

---

## 📄 Corporate & Infrastructure Strategy
Designed for scale (10K+ students), the portal includes a comprehensive roadmap for infrastructure management, revenue modeling, and market competition.


---

## 🎨 Design Philosophy: "Intellectual Atelier"
Moving away from generic admin templates, this portal adopts a premium aesthetic:
-   **Negative Space**: Expansive use of whitespace for focus.
-   **Tonal Layering**: Subtle shadows and glassmorphism.
-   **Typography Focus**: High-contrast headings and refined micro-interactions.

---
© 2026 RKGIT Placement Portal Development Team
