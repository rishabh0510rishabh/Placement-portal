const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Models (Simplified for seeding but matching StudentProfile schema strictly)
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], default: 'student' },
  name: { type: String, required: true },
  isVerified: { type: Boolean, default: true }
});

const CompanySchema = new mongoose.Schema({
  name: String,
  industry: String,
  status: { type: String, default: 'active' }
});

const JobListingSchema = new mongoose.Schema({
  companyId: mongoose.Schema.Types.ObjectId,
  companyName: String,
  category: String,
  role: String,
  description: String,
  minimumCgpa: Number,
  allowedBranches: [String],
  requiredSkills: [String],
  maximumBacklogs: Number,
  salaryCtc: String,
  location: String,
  deadline: Date,
  status: { type: String, default: 'active' }
}, { timestamps: true });

const StudentProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  fullName: { type: String, required: true },
  rollNumber: { type: String, required: true },
  collegeId: { type: String, required: true },
  branch: { type: String, required: true },
  section: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true },
  currentSemester: { type: Number, required: true },
  academicDetails: {
    semesters: [
      { semester: Number, gpa: Number }
    ],
    cgpa: Number,
    activeBacklogs: Number
  },
  skills: {
    programmingLanguages: [String],
    frameworks: [String],
    tools: [String],
    databases: [String],
    technologies: [String]
  },
  projects: [
    {
      title: String,
      description: String,
      technologies: [String],
      githubLink: String
    }
  ],
  experience: [
    {
      company: String,
      role: String,
      startDate: Date,
      endDate: Date,
      isCurrentRole: Boolean,
      description: String
    }
  ],
  links: {
    linkedin: String,
    github: String,
    portfolio: String,
    leetcode: String
  }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Company = mongoose.models.Company || mongoose.model('Company', CompanySchema);
const JobListing = mongoose.models.JobListing || mongoose.model('JobListing', JobListingSchema);
const StudentProfile = mongoose.models.StudentProfile || mongoose.model('StudentProfile', StudentProfileSchema);

async function seed() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is not set.');
    process.exit(1);
  }
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Company.deleteMany({});
    await JobListing.deleteMany({});
    await StudentProfile.deleteMany({});
    console.log('Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 12);

    // 1. Create Admin
    await User.create({
      name: 'RKGIT Admin Panel',
      email: 'admin@rkgit.edu.in',
      password: hashedPassword,
      role: 'admin'
    });

    // 2. Create Demo Student User
    const studentUser = await User.create({
      name: 'Rohan Sharma',
      email: 'student@rkgit.edu.in',
      password: hashedPassword,
      role: 'student'
    });

    // 3. Create Rich Student Profile
    await StudentProfile.create({
      userId: studentUser._id,
      fullName: 'Rohan Sharma',
      rollNumber: '2101330100067',
      collegeId: 'RKGIT-2021-CSE-067',
      branch: 'CSE',
      section: 'A',
      phoneNumber: '9876543210',
      email: 'student@rkgit.edu.in',
      currentSemester: 7,
      academicDetails: {
        semesters: [
          { semester: 1, gpa: 8.2 },
          { semester: 2, gpa: 8.5 },
          { semester: 3, gpa: 8.7 },
          { semester: 4, gpa: 8.9 },
          { semester: 5, gpa: 9.0 },
          { semester: 6, gpa: 9.2 }
        ],
        cgpa: 8.8,
        activeBacklogs: 0
      },
      skills: {
        programmingLanguages: ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++'],
        frameworks: ['React.js', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'],
        tools: ['Git', 'GitHub', 'Docker', 'Postman', 'VS Code'],
        databases: ['MongoDB', 'PostgreSQL', 'Redis'],
        technologies: ['AWS', 'REST APIs', 'Cloud Computing', 'WebSockets']
      },
      projects: [
        {
          title: '3D Typing Tutor',
          description: 'A high-fidelity typing tutor with interactive 3D hand guides and real-time ML-powered coaching.',
          technologies: ['React', 'Three.js', 'TensorFlow.js', 'Framer Motion'],
          githubLink: 'https://github.com/rohan-sharma/typing-tutor'
        },
        {
          title: 'RKGIT Dashboard',
          description: 'A centralized portal for academic management with glassmorphic UI and real-time notifications.',
          technologies: ['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL'],
          githubLink: 'https://github.com/rohan-sharma/rkgit-portal'
        }
      ],
      experience: [
        {
          company: 'TATA 1mg',
          role: 'Full Stack Development Intern',
          startDate: new Date('2023-06-01'),
          endDate: new Date('2023-08-31'),
          isCurrentRole: false,
          description: 'Worked on the pharmacy inventory management module. Optimized slow API responses by 40% using Redis caching.'
        }
      ],
      links: {
        linkedin: 'https://linkedin.com/in/rohan-sharma-rkgit',
        github: 'https://github.com/rohan-sharma-dev',
        portfolio: 'https://rohan-sharma.me',
        leetcode: 'https://leetcode.com/rohan_dev'
      }
    });

    // 4. Create Indian Companies
    const companies = await Company.insertMany([
      { name: 'Tata Consultancy Services', industry: 'IT Services' },
      { name: 'Zomato', industry: 'Product' },
      { name: 'Reliance Jio', industry: 'Telecommunications' },
      { name: 'Infosys', industry: 'IT Services' },
      { name: 'HCL Tech', industry: 'IT Services' },
      { name: 'Zoho Corporation', industry: 'SaaS' }
    ]);

    // 5. Create Jobs (LPA context)
    await JobListing.insertMany([
      {
        companyId: companies[1]._id,
        companyName: 'Zomato',
        category: 'Full-time',
        role: 'Software Development Engineer - I',
        description: 'Building world-class food delivery experiences. Focus on low-latency systems and scalable architecture.',
        minimumCgpa: 7.5,
        allowedBranches: ['CSE', 'IT', 'ECE'],
        requiredSkills: ['Node.js', 'React', 'TypeScript', 'Go'],
        maximumBacklogs: 0,
        salaryCtc: '24.0 - 45.0 LPA',
        location: 'Gurgaon, Haryana',
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      },
      {
        companyId: companies[2]._id,
        companyName: 'Reliance Jio',
        category: 'Full-time',
        role: 'Graduate Engineer Trainee',
        description: 'Join the Jio Platforms team to work on AI-driven network optimization and next-gen cloud services.',
        minimumCgpa: 8.0,
        allowedBranches: ['CSE', 'IT'],
        requiredSkills: ['Python', 'Cloud Computing', 'Data Structures'],
        maximumBacklogs: 0,
        salaryCtc: '12.0 - 18.0 LPA',
        location: 'Navi Mumbai',
        deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
      },
      {
        companyId: companies[5]._id,
        companyName: 'Zoho Corporation',
        category: 'Full-time',
        role: 'Full Stack Developer',
        description: 'Help build Zoho Office Suite. Candidates must have strong problem-solving skills and love for clean code.',
        minimumCgpa: 7.0,
        allowedBranches: ['CSE', 'IT', 'ECE', 'EEE'],
        requiredSkills: ['Java', 'JavaScript', 'SQL'],
        maximumBacklogs: 1,
        salaryCtc: '8.0 - 14.0 LPA',
        location: 'Chennai / Tenkasi',
        deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
      }
    ]);

    console.log('Database seeded with rich demo data for Rohan Sharma!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
