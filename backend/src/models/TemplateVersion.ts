import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplateVersion extends Document {
  _id: mongoose.Types.ObjectId;
  templateId: mongoose.Types.ObjectId;
  version: string;
  description: string;
  changes?: string;
  author: mongoose.Types.ObjectId;
  authorName?: string;
  
  // Content snapshot
  content: {
    components?: any;
    pages?: any;
    config?: any;
  };
  
  // Version metadata
  isMajor: boolean;
  isMinor: boolean;
  isPatch: boolean;
  releasedAt: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

const templateVersionSchema = new Schema<ITemplateVersion>(
  {
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template',
      required: [true, 'Template ID is required'],
      index: true,
    },
    version: {
      type: String,
      required: [true, 'Version number is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Version description is required'],
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    changes: {
      type: String,
      maxlength: [2000, 'Changes cannot exceed 2000 characters'],
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author ID is required'],
    },
    authorName: String,
    
    // Content snapshot
    content: {
      components: Schema.Types.Mixed,
      pages: Schema.Types.Mixed,
      config: Schema.Types.Mixed,
    },
    
    // Version type
    isMajor: {
      type: Boolean,
      default: false,
    },
    isMinor: {
      type: Boolean,
      default: false,
    },
    isPatch: {
      type: Boolean,
      default: true,
    },
    releasedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
templateVersionSchema.index({ templateId: 1, version: 1 }, { unique: true });
templateVersionSchema.index({ templateId: 1, releasedAt: -1 });
templateVersionSchema.index({ author: 1 });

export default mongoose.model<ITemplateVersion>('TemplateVersion', templateVersionSchema);
