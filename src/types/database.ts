// --- SHARED ENUMS ---
export enum Role {
  student = 'student',
  admin = 'admin',
}

export enum Branch {
  CSE = 'CSE',
  CSE_AI = 'CSE_AI',
  CSE_DS = 'CSE_DS',
  ECE = 'ECE',
  EE = 'EE',
  ME = 'ME',
  CE = 'CE',
  IT = 'IT',
  EN = 'EN',
  Other = 'Other',
}

// --- STUDENT MODELS ---
export interface StudentProfile {
  id: string;
  userId: string;
  fullName: string;
  rollNumber: string;
  collegeId: string;
  branch: Branch;
  section: string;
  phoneNumber: string;
  email: string;
  currentSemester: number;
  cgpa: number;
  activeBacklogs: number;
  skills?: any; // JSON
  linkedin?: string;
  github?: string;
  portfolio?: string;
  leetcode?: string;
  resumeUrl?: string;
  resumeFilename?: string;
}

export interface Project {
  id: string;
  studentProfileId: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink?: string;
}

export interface WorkExperience {
  id: string;
  studentProfileId: string;
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  isCurrentRole: boolean;
  description: string;
}

// --- PLACEMENT MODELS ---
export interface Company {
  id: string;
  name: string;
  industry: string;
  website?: string;
  logo?: string;
  description?: string;
  status: string;
}

export interface JobListing {
  id: string;
  companyId: string;
  category: string;
  role: string;
  description: string;
  minimumCgpa: number;
  allowedBranches: Branch[];
  requiredSkills: string[];
  maximumBacklogs: number;
  salaryCtc: string;
  location: string;
  deadline: string;
  status: string;
  company?: Company;
}
