import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  categoryName?: string;
  createdBy: mongoose.Types.ObjectId;
  createdByUser?: string;
  
  // Content and Structure
  preview?: {
    image: string;
    thumbnail?: string;
    gallery?: string[];
  };
  supportedStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    authentication: string[];
  };
  components: {
    name: string;
    description?: string;
    category?: string;
  }[];
  pages: {
    name: string;
    description?: string;
    slug?: string;
  }[];
  
  // Version and Status
  version: string;
  status: 'draft' | 'published' | 'deprecated' | 'archived';
  publishedAt?: Date;
  
  // Metadata
  tags: string[];
  isFeatured: boolean;
  isRecent: boolean;
  
  // Rating and Usage
  rating: {
    average: number;
    count: number;
    sum: number;
  };
  downloads: number;
  views: number;
  
  // User Interaction
  favorites: mongoose.Types.ObjectId[];
  reviews?: {
    userId: mongoose.Types.ObjectId;
    rating: number;
    comment?: string;
    createdAt: Date;
  }[];
  
  // AI Recommendations
  aiScore?: number;
  aiKeywords?: string[];
  
  // Compatibility
  minNodeVersion?: string;
  maxNodeVersion?: string;
  compatibility?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const templateSchema = new Schema<ITemplate>(
  {
    name: {
      type: String,
      required: [true, 'Template name is required'],
      trim: true,
      minlength: [1, 'Template name cannot be empty'],
      maxlength: [100, 'Template name cannot exceed 100 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Template description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'TemplateCategory',
      required: [true, 'Category is required'],
      index: true,
    },
    categoryName: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator ID is required'],
      index: true,
    },
    createdByUser: String,
    
    // Preview and Content
    preview: {
      image: {
        type: String,
        default: '',
      },
      thumbnail: String,
      gallery: [String],
    },
    supportedStack: {
      frontend: [String],
      backend: [String],
      database: [String],
      authentication: [String],
    },
    components: [
      {
        name: String,
        description: String,
        category: String,
      },
    ],
    pages: [
      {
        name: String,
        description: String,
        slug: String,
      },
    ],
    
    // Version and Status
    version: {
      type: String,
      default: '1.0.0',
      index: true,
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'deprecated', 'archived'],
      default: 'draft',
      index: true,
    },
    publishedAt: Date,
    
    // Metadata
    tags: {
      type: [String],
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    isRecent: {
      type: Boolean,
      default: false,
      index: true,
    },
    
    // Rating and Usage
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      sum: {
        type: Number,
        default: 0,
      },
    },
    downloads: {
      type: Number,
      default: 0,
      index: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    
    // User Interaction
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    reviews: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        rating: {
          type: Number,
          min: 1,
          max: 5,
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    
    // AI Features
    aiScore: {
      type: Number,
      default: 0,
      index: true,
    },
    aiKeywords: [String],
    
    // Compatibility
    minNodeVersion: String,
    maxNodeVersion: String,
    compatibility: [String],
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
templateSchema.index({ category: 1, status: 1 });
templateSchema.index({ createdBy: 1, status: 1 });
templateSchema.index({ tags: 1 });
templateSchema.index({ 'rating.average': -1 });
templateSchema.index({ downloads: -1 });
templateSchema.index({ isFeatured: 1, status: 1 });

export default mongoose.model<ITemplate>('Template', templateSchema);
