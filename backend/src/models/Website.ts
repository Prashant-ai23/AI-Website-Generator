import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsite extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  userId: mongoose.Types.ObjectId;
  content: Record<string, unknown>;
  theme: string;
  isPublished: boolean;
  pages?: Array<{
    id: string;
    title: string;
    slug: string;
    content: Record<string, any>;
  }>;
  components?: string[];
  analytics?: {
    views: number;
    visitors: number;
    lastVisited?: Date;
  };
  seo?: {
    keywords?: string[];
    metaDescription?: string;
    ogImage?: string;
  };
  domain?: string;
  status: 'draft' | 'preview' | 'published';
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const websiteSchema = new Schema<IWebsite>(
  {
    title: {
      type: String,
      required: [true, 'Website title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
      default: {},
    },
    theme: {
      type: String,
      default: 'default',
      enum: ['default', 'minimal', 'modern', 'professional', 'creative', 'custom'],
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    pages: {
      type: [
        {
          id: String,
          title: String,
          slug: {
            type: String,
            lowercase: true,
            match: /^[a-z0-9-]*$/,
          },
          content: Schema.Types.Mixed,
        },
      ],
      default: [],
    },
    components: {
      type: [String],
      default: [],
    },
    analytics: {
      views: {
        type: Number,
        default: 0,
        min: 0,
      },
      visitors: {
        type: Number,
        default: 0,
        min: 0,
      },
      lastVisited: Date,
    },
    seo: {
      keywords: {
        type: [String],
        default: [],
      },
      metaDescription: {
        type: String,
        maxlength: [160, 'Meta description cannot exceed 160 characters'],
      },
      ogImage: {
        type: String,
        validate: {
          validator: function (v: string) {
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: 'OG Image must be a valid URL',
        },
      },
    },
    domain: {
      type: String,
      sparse: true,
      validate: {
        validator: function (v: string) {
          return !v || /^([a-z0-9](-?[a-z0-9])*\.)+[a-z]{2,}$|^localhost/.test(v);
        },
        message: 'Invalid domain format',
      },
    },
    status: {
      type: String,
      enum: ['draft', 'preview', 'published'],
      default: 'draft',
      index: true,
    },
    version: {
      type: Number,
      default: 1,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
websiteSchema.index({ userId: 1, createdAt: -1 });
websiteSchema.index({ status: 1 });
websiteSchema.index({ isPublished: 1 });
websiteSchema.index({ userId: 1, status: 1 });
websiteSchema.index({ title: 'text', description: 'text' });

// Virtual for owner
websiteSchema.virtual('owner', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Pre-save hook to increment version
websiteSchema.pre('save', function (next) {
  if (this.isModified('content') || this.isModified('pages')) {
    this.version = (this.version || 1) + 1;
  }
  next();
});

// Instance method to publish
websiteSchema.methods.publish = function () {
  this.isPublished = true;
  this.status = 'published';
  return this.save();
};

// Instance method to unpublish
websiteSchema.methods.unpublish = function () {
  this.isPublished = false;
  this.status = 'draft';
  return this.save();
};

// Instance method to track view
websiteSchema.methods.recordView = function () {
  if (!this.analytics) this.analytics = {};
  this.analytics.views = (this.analytics.views || 0) + 1;
  this.analytics.lastVisited = new Date();
  return this.save();
};

// Static for finding user websites
websiteSchema.statics.findUserWebsites = function (userId: string) {
  return this.find({ userId: new mongoose.Types.ObjectId(userId) }).sort({ createdAt: -1 });
};

// Static for finding published websites
websiteSchema.statics.findPublished = function () {
  return this.find({ isPublished: true, status: 'published' }).sort({ 'analytics.views': -1 });
};

export const Website = mongoose.model<IWebsite>('Website', websiteSchema);
