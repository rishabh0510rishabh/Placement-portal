import mongoose, { Schema, Document, Model } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'job_alert' | 'status_update' | 'system';
  read: boolean;
  relatedId?: mongoose.Types.ObjectId;
  createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['job_alert', 'status_update', 'system'],
      default: 'system',
    },
    read: { type: Boolean, default: false },
    relatedId: { type: Schema.Types.ObjectId },
  },
  {
    timestamps: true,
  }
);

// Index for fast fetching of unread notifications for a specific user
NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

const Notification: Model<INotification> =
  mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);

export default Notification;
