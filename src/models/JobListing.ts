import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJobListing extends Document {
  companyName: string;
  role: string;
  description: string;
  minimumCgpa: number;
  allowedBranches: string[];
  requiredSkills: string[];
  maximumBacklogs: number;
  salaryCtc: string;
  ctcBreakdown: string;
  location: string;
  deadline: Date;
  status: 'active' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const JobListingSchema: Schema<IJobListing> = new Schema(
  {
    companyName: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    minimumCgpa: { type: Number, required: true, min: 0, max: 10 },
    allowedBranches: [{ type: String, required: true }],
    requiredSkills: [{ type: String }],
    maximumBacklogs: { type: Number, required: true, min: 0 },
    salaryCtc: { type: String, required: true },
    ctcBreakdown: { type: String, trim: true },
    location: { type: String, required: true, trim: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ['active', 'closed'], default: 'active' },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recreating the model if it already exists
const JobListing: Model<IJobListing> =
  mongoose.models.JobListing || mongoose.model<IJobListing>('JobListing', JobListingSchema);

export default JobListing;
