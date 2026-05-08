import mongoose, { Document, Schema } from 'mongoose';

/**
 * GeneratedFile Schema
 * Stores generated code files from MCP tools
 */
export interface IGeneratedFile extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  fileName: string;
  fileType: 'react' | 'express' | 'schema' | 'menu' | 'documentation' | 'other';
  language: string;
  content: string;
  generatedByTool: 'generateReactPage' | 'generateExpressAPI' | 'generateMongoSchema' | 'generateSidebarMenu' | 'generateDocumentation';
  toolParameters?: Record<string, any>;
  metadata?: {
    lines?: number;
    size?: number;
    complexity?: 'simple' | 'moderate' | 'complex';
    dependencies?: string[];
  };
  status: 'draft' | 'saved' | 'integrated' | 'archived';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const generatedFileSchema = new Schema<IGeneratedFile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      index: true,
      sparse: true,
    },
    fileName: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      match: [/^[\w\-. ]+\.(ts|tsx|js|jsx|json|md|sql)$/, 'Invalid file name or extension'],
    },
    fileType: {
      type: String,
      enum: ['react', 'express', 'schema', 'menu', 'documentation', 'other'],
      required: [true, 'File type is required'],
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      enum: ['typescript', 'javascript', 'json', 'markdown', 'sql'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [1, 'Content cannot be empty'],
    },
    generatedByTool: {
      type: String,
      enum: ['generateReactPage', 'generateExpressAPI', 'generateMongoSchema', 'generateSidebarMenu', 'generateDocumentation'],
      required: [true, 'Generation tool is required'],
    },
    toolParameters: {
      type: Schema.Types.Mixed,
      default: {},
    },
    metadata: {
      lines: Number,
      size: Number,
      complexity: {
        type: String,
        enum: ['simple', 'moderate', 'complex'],
      },
      dependencies: [String],
    },
    status: {
      type: String,
      enum: ['draft', 'saved', 'integrated', 'archived'],
      default: 'draft',
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      index: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
generatedFileSchema.index({ userId: 1, createdAt: -1 });
generatedFileSchema.index({ projectId: 1, fileType: 1 });
generatedFileSchema.index({ fileType: 1, status: 1 });
generatedFileSchema.index({ generatedByTool: 1 });
generatedFileSchema.index({ tags: 1 });
generatedFileSchema.index({ expiresAt: 1 }, { sparse: true });

// TTL index for auto-deletion of expired files
generatedFileSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

// Pre-save hook to calculate metadata
generatedFileSchema.pre('save', function (next) {
  if (this.content) {
    this.metadata = this.metadata || {};
    this.metadata.lines = this.content.split('\n').length;
    this.metadata.size = Buffer.byteLength(this.content, 'utf8');
    
    // Estimate complexity based on content
    const complexityScore = (
      (this.content.match(/import|from/g) || []).length +
      (this.content.match(/function|const|class/g) || []).length +
      (this.content.match(/\{|\}|\(|\)|\[|\]/g) || []).length
    );
    
    if (complexityScore < 20) this.metadata.complexity = 'simple';
    else if (complexityScore < 50) this.metadata.complexity = 'moderate';
    else this.metadata.complexity = 'complex';
  }
  next();
});

// Virtual for quick link to project
generatedFileSchema.virtual('projectName', {
  ref: 'Project',
  localField: 'projectId',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name' },
});

export const GeneratedFile = mongoose.model<IGeneratedFile>('GeneratedFile', generatedFileSchema);
