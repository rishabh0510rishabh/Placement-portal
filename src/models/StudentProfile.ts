import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  rollNumber: string;
  collegeId: string;
  branch: string;
  section: string;
  phoneNumber: string;
  email: string;
  currentSemester: number;
  academicDetails: {
    semesters: { semester: number; gpa: number }[];
    cgpa: number;
    activeBacklogs: number;
  };
  skills: {
    programmingLanguages: string[];
    frameworks: string[];
    tools: string[];
    databases: string[];
    technologies: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const StudentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Roll number is required'],
      trim: true,
      unique: true,
    },
    collegeId: {
      type: String,
      required: [true, 'College ID is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      enum: [
        'CSE',
        'CSE-AI',
        'CSE-DS',
        'ECE',
        'EE',
        'ME',
        'CE',
        'IT',
        'EN',
        'Other',
      ],
    },
    section: {
      type: String,
      required: [true, 'Section is required'],
      trim: true,
      uppercase: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: 'Please enter a valid 10-digit Indian mobile number.',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    currentSemester: {
      type: Number,
      required: [true, 'Current semester is required'],
      min: [1, 'Semester must be between 1 and 8'],
      max: [8, 'Semester must be between 1 and 8'],
    },
    academicDetails: {
      semesters: [
        {
          semester: { type: Number, required: true },
          gpa: { type: Number, required: true },
        },
      ],
      cgpa: {
        type: Number,
        default: 0,
      },
      activeBacklogs: {
        type: Number,
        default: 0,
      },
    },
    skills: {
      programmingLanguages: { type: [String], default: [] },
      frameworks:           { type: [String], default: [] },
      tools:                { type: [String], default: [] },
      databases:            { type: [String], default: [] },
      technologies:         { type: [String], default: [] },
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile: Model<IStudentProfile> =
  mongoose.models.StudentProfile ||
  mongoose.model<IStudentProfile>('StudentProfile', StudentProfileSchema);

export default StudentProfile;
