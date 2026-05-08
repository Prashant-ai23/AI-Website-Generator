import mongoose, { Schema, Document } from 'mongoose';

interface IGeneratedProject extends Document {
  userId: mongoose.Types.ObjectId;
  projectName: string;
  projectPath: string;
  description?: string;
  structure?: Record<string, any>;
  files: Array<{
    fileName: string;
    filePath: string;
    size: number;
    created: boolean;
    updated: boolean;
  }>;
  folders: string[];
  totalFiles: number;
  totalSize: number;
  status: 'success' | 'partial' | 'failed';
  generationErrors?: string[];
  metadata?: {
    framework?: string;
    language?: string;
    modules?: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

const generatedProjectSchema = new Schema<IGeneratedProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    projectPath: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    structure: {
      type: Schema.Types.Mixed,
    },
    files: [
      {
        fileName: String,
        filePath: String,
        size: Number,
        created: Boolean,
        updated: Boolean,
      },
    ],
    folders: [String],
    totalFiles: {
      type: Number,
      default: 0,
    },
    totalSize: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['success', 'partial', 'failed'],
      default: 'success',
    },
    generationErrors: [String],
    metadata: {
      framework: String,
      language: String,
      modules: [String],
    },
  },
  { timestamps: true }
);

// Index for user's projects
generatedProjectSchema.index({ userId: 1, createdAt: -1 });

// TTL index to auto-delete projects after 30 days
generatedProjectSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

const GeneratedProject = mongoose.model<IGeneratedProject>('GeneratedProject', generatedProjectSchema);

export { GeneratedProject, IGeneratedProject };
export default GeneratedProject;
