import mongoose, { Document, Schema } from 'mongoose';

/**
 * PromptHistory Schema
 * Tracks user prompts and their generated results
 */
export interface IPromptHistory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  projectId?: mongoose.Types.ObjectId;
  prompt: string;
  toolUsed: 'generateReactPage' | 'generateExpressAPI' | 'generateMongoSchema' | 'generateSidebarMenu' | 'generateDocumentation';
  parameters: Record<string, any>;
  generatedFileId?: mongoose.Types.ObjectId;
  result: {
    success: boolean;
    output?: string;
    error?: string;
    duration?: number; // milliseconds
  };
  metadata?: {
    promptLength?: number;
    tokensUsed?: number;
    model?: string;
    temperature?: number;
  };
  feedback?: {
    rating?: 1 | 2 | 3 | 4 | 5;
    comment?: string;
    isUseful?: boolean;
  };
  tags: string[];
  category?: 'frontend' | 'backend' | 'database' | 'documentation' | 'other';
  createdAt: Date;
  updatedAt: Date;
}

const promptHistorySchema = new Schema<IPromptHistory>(
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
      sparse: true,
      index: true,
    },
    prompt: {
      type: String,
      required: [true, 'Prompt is required'],
      trim: true,
      minlength: [5, 'Prompt must be at least 5 characters'],
      maxlength: [5000, 'Prompt cannot exceed 5000 characters'],
    },
    toolUsed: {
      type: String,
      enum: ['generateReactPage', 'generateExpressAPI', 'generateMongoSchema', 'generateSidebarMenu', 'generateDocumentation'],
      required: [true, 'Tool used is required'],
      index: true,
    },
    parameters: {
      type: Schema.Types.Mixed,
      required: [true, 'Parameters are required'],
      default: {},
    },
    generatedFileId: {
      type: Schema.Types.ObjectId,
      ref: 'GeneratedFile',
      sparse: true,
    },
    result: {
      success: {
        type: Boolean,
        required: true,
        default: false,
      },
      output: {
        type: String,
        maxlength: [50000, 'Output cannot exceed 50000 characters'],
      },
      error: String,
      duration: {
        type: Number,
        min: 0,
      },
    },
    metadata: {
      promptLength: Number,
      tokensUsed: Number,
      model: String,
      temperature: {
        type: Number,
        min: 0,
        max: 2,
      },
    },
    feedback: {
      rating: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        sparse: true,
      },
      comment: {
        type: String,
        maxlength: [1000, 'Feedback cannot exceed 1000 characters'],
      },
      isUseful: Boolean,
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      enum: ['frontend', 'backend', 'database', 'documentation', 'other'],
      default: 'other',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
promptHistorySchema.index({ userId: 1, createdAt: -1 });
promptHistorySchema.index({ userId: 1, toolUsed: 1, createdAt: -1 });
promptHistorySchema.index({ projectId: 1, createdAt: -1 });
promptHistorySchema.index({ 'result.success': 1 });
promptHistorySchema.index({ tags: 1 });
promptHistorySchema.index({ category: 1 });
promptHistorySchema.index({ 'feedback.rating': 1 });
promptHistorySchema.index({ toolUsed: 1 });

// Text index for searching prompts
promptHistorySchema.index({ prompt: 'text' });

// Pre-save hook to calculate metadata
promptHistorySchema.pre('save', function (next) {
  if (this.prompt && !this.metadata?.promptLength) {
    this.metadata = this.metadata || {};
    this.metadata.promptLength = this.prompt.length;
  }
  next();
});

// Virtual for related file
promptHistorySchema.virtual('generatedFile', {
  ref: 'GeneratedFile',
  localField: 'generatedFileId',
  foreignField: '_id',
  justOne: true,
});

// Statics for common queries
promptHistorySchema.statics.findByUser = function (userId: string, limit: number = 50) {
  return this.find({ userId }).sort({ createdAt: -1 }).limit(limit);
};

promptHistorySchema.statics.findSuccessfulPrompts = function (userId: string) {
  return this.find({ userId, 'result.success': true }).sort({ createdAt: -1 });
};

promptHistorySchema.statics.findByTool = function (userId: string, tool: string) {
  return this.find({ userId, toolUsed: tool }).sort({ createdAt: -1 });
};

promptHistorySchema.statics.getAverageRating = function (userId: string) {
  return this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId), 'feedback.rating': { $exists: true } } },
    {
      $group: {
        _id: '$toolUsed',
        averageRating: { $avg: '$feedback.rating' },
        totalRatings: { $sum: 1 },
      },
    },
  ]);
};

const PromptHistory = mongoose.model<IPromptHistory>('PromptHistory', promptHistorySchema);

export default PromptHistory;
