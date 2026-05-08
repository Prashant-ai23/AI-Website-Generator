import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'user' | 'admin';
  profile?: {
    avatar?: string;
    bio?: string;
    location?: string;
  };
  preferences?: {
    theme?: 'light' | 'dark';
    emailNotifications?: boolean;
    language?: string;
  };
  stats?: {
    projectsCount?: number;
    generatedFilesCount?: number;
    promtsCount?: number;
  };
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
      index: true,
    },
    profile: {
      avatar: {
        type: String,
        validate: {
          validator: function (v: string) {
            return !v || /^https?:\/\/.+/.test(v);
          },
          message: 'Avatar must be a valid URL',
        },
      },
      bio: {
        type: String,
        maxlength: [500, 'Bio cannot exceed 500 characters'],
      },
      location: String,
    },
    preferences: {
      theme: {
        type: String,
        enum: ['light', 'dark'],
        default: 'light',
      },
      emailNotifications: {
        type: Boolean,
        default: true,
      },
      language: {
        type: String,
        default: 'en',
      },
    },
    stats: {
      projectsCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      generatedFilesCount: {
        type: Number,
        default: 0,
        min: 0,
      },
      promtsCount: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ createdAt: -1 });
userSchema.index({ isActive: 1 });

// Pre-save hook for password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Instance method for password comparison
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Virtual for user's full stats
userSchema.virtual('totalActivities').get(function () {
  const stats = this.stats || {};
  return (stats.projectsCount || 0) + (stats.generatedFilesCount || 0) + (stats.promtsCount || 0);
});

// Statics for common queries
userSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findActiveUsers = function () {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

export const User = mongoose.model<IUser>('User', userSchema);
