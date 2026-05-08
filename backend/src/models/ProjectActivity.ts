import mongoose, { Schema, Document } from 'mongoose';

export interface IProjectActivity extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  userName: string;
  action: 'created' | 'updated' | 'deleted' | 'archived' | 'published' | 'duplicated' | 'restored';
  description: string;
  changes?: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
}

const projectActivitySchema = new Schema<IProjectActivity>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required'],
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    userName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: ['created', 'updated', 'deleted', 'archived', 'published', 'duplicated', 'restored'],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    changes: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    collection: 'project_activities',
  }
);

// Indexes
projectActivitySchema.index({ projectId: 1, timestamp: -1 });
projectActivitySchema.index({ userId: 1, timestamp: -1 });
projectActivitySchema.index({ action: 1, timestamp: -1 });

export const ProjectActivity = mongoose.model<IProjectActivity>('ProjectActivity', projectActivitySchema);
