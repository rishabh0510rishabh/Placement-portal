import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJobApplication extends Document {
  jobId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  resumeUrl: string;
  status: 'applied' | 'shortlisted' | 'interviewing' | 'rejected' | 'hired';
  createdAt: Date;
  updatedAt: Date;
}

const JobApplicationSchema: Schema<IJobApplication> = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'JobListing', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resumeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'interviewing', 'rejected', 'hired'],
      default: 'applied',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate applications for the same job by the same user
JobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

const JobApplication: Model<IJobApplication> =
  mongoose.models.JobApplication || mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

export default JobApplication;
