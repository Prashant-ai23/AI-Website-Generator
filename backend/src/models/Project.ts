import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  type: 'website' | 'blog' | 'portfolio' | 'ecommerce' | 'saas' | 'custom';
  status: 'draft' | 'published' | 'archived' | 'active' | 'completed';
  content: Record<string, any>;
  settings: {
    theme?: string;
    domain?: string;
    seoMetadata?: Record<string, string>;
    publicUrl?: string;
  };
  techStack?: {
    frontend?: string;
    backend?: string;
    database?: string;
    authentication?: string;
    other?: string[];
  };
  metadata?: {
    pageCount?: number;
    componentCount?: number;
    lastModifiedBy?: string;
    lastModifiedByUserId?: mongoose.Types.ObjectId;
    version?: number;
    createdByUser?: string;
  };
  tags: string[];
  isFavorite?: boolean;
  views: number;
  collaborators?: mongoose.Types.ObjectId[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const projectSchema = new Schema<IProject>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      minlength: [1, 'Project name cannot be empty'],
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    type: {
      type: String,
      enum: ['website', 'blog', 'portfolio', 'ecommerce', 'saas', 'custom'],
      default: 'website',
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived', 'active', 'completed'],
      default: 'draft',
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    settings: {
      theme: String,
      domain: {
        type: String,
        validate: {
          validator: function (v: string) {
            return !v || /^([a-z0-9](-?[a-z0-9])*\.)+[a-z]{2,}$|^localhost/.test(v);
          },
          message: 'Invalid domain format',
        },
      },
      seoMetadata: Schema.Types.Mixed,
      publicUrl: String,
    },
    techStack: {
      frontend: {
        type: String,
        enum: ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt', 'None', ''],
        default: '',
      },
      backend: {
        type: String,
        enum: ['Node.js/Express', 'Python/Django', 'Python/Flask', 'Java/Spring', 'Go', 'Rust', 'None', ''],
        default: '',
      },
      database: {
        type: String,
        enum: ['MongoDB', 'PostgreSQL', 'MySQL', 'Firebase', 'Redis', 'None', ''],
        default: '',
      },
      authentication: {
        type: String,
        enum: ['JWT', 'OAuth2', 'Firebase Auth', 'Auth0', 'Session', 'None', ''],
        default: '',
      },
      other: {
        type: [String],
        default: [],
      },
    },
    metadata: {
      pageCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      componentCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      lastModifiedBy: String,
      lastModifiedByUserId: Schema.Types.ObjectId,
      createdByUser: String,
      version: {
        type: Number,
        default: 1,
        min: 1,
      },
    },
    tags: {
      type: [String],
      default: [],
      index: true,
    },
    isFavorite: {
      type: Boolean,
      default: false,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    collaborators: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { 
    timestamps: true,
  }
);

// Indexes for performance
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ userId: 1, updatedAt: -1 });
projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ userId: 1, isFavorite: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ type: 1 });
projectSchema.index({ userId: 1, status: 1 });
projectSchema.index({ isPublic: 1, status: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ isFavorite: 1 });
projectSchema.index({ 'metadata.version': 1 });

// Text index for searching projects
projectSchema.index({ name: 'text', description: 'text' });

// Virtual for owner details (lazy loaded)
projectSchema.virtual('owner', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Pre-save hook to increment version on update
projectSchema.pre('save', function (next) {
  if (this.isModified('content') && this.metadata) {
    this.metadata.version = (this.metadata.version || 1) + 1;
  }
  next();
});

// Instance method to publish project
projectSchema.methods.publish = function () {
  this.status = 'published';
  return this.save();
};

// Instance method to archive project
projectSchema.methods.archive = function () {
  this.status = 'archived';
  return this.save();
};

// Static for finding user projects
projectSchema.statics.findUserProjects = function (userId: string, status?: string) {
  const query: any = { userId: new mongoose.Types.ObjectId(userId) };
  if (status) query.status = status;
  return this.find(query).sort({ createdAt: -1 });
};

// Static for finding public projects
projectSchema.statics.findPublic = function () {
  return this.find({ isPublic: true, status: 'published' }).sort({ views: -1 });
};

export const Project = mongoose.model<IProject>('Project', projectSchema);
