import mongoose, { Schema, Document } from 'mongoose';

export interface IRequirementAnalysis extends Document {
  projectId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  
  // Original prompt
  originalPrompt: string;
  
  // Analyzed requirements
  requirements: {
    modules: Array<{
      name: string;
      description: string;
      pages?: string[];
      apis?: string[];
    }>;
    pages: Array<{
      name: string;
      slug: string;
      description: string;
      components: string[];
    }>;
    apis: Array<{
      endpoint: string;
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
      description: string;
      params?: string[];
      response?: string;
    }>;
    collections: Array<{
      name: string;
      fields: Array<{
        name: string;
        type: string;
        required: boolean;
        description?: string;
      }>;
    }>;
    authentication: {
      required: boolean;
      type: 'JWT' | 'OAuth' | 'Session' | 'API_KEY';
      methods?: string[];
    };
    userRoles: Array<{
      name: string;
      permissions: string[];
    }>;
  };
  
  // AI insights
  insights: {
    projectScope: 'small' | 'medium' | 'large';
    estimatedComplexity: 'low' | 'medium' | 'high';
    suggestedTechStack: {
      frontend: string[];
      backend: string[];
      database: string[];
    };
    recommendedFeatures: string[];
    scalabilityConsiderations: string[];
  };
  
  // Status
  status: 'analyzing' | 'completed' | 'failed';
  confidence: number; // 0-100
  errors?: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

const RequirementAnalysisSchema = new Schema<IRequirementAnalysis>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: 'GeneratedProject',
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalPrompt: {
      type: String,
      required: true,
    },
    requirements: {
      modules: [
        {
          name: String,
          description: String,
          pages: [String],
          apis: [String],
        },
      ],
      pages: [
        {
          name: String,
          slug: String,
          description: String,
          components: [String],
        },
      ],
      apis: [
        {
          endpoint: String,
          method: { type: String, enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
          description: String,
          params: [String],
          response: String,
        },
      ],
      collections: [
        {
          name: String,
          fields: [
            {
              name: String,
              type: String,
              required: Boolean,
              description: String,
            },
          ],
        },
      ],
      authentication: {
        required: Boolean,
        type: { type: String, enum: ['JWT', 'OAuth', 'Session', 'API_KEY'] },
        methods: [String],
      },
      userRoles: [
        {
          name: String,
          permissions: [String],
        },
      ],
    },
    insights: {
      projectScope: {
        type: String,
        enum: ['small', 'medium', 'large'],
      },
      estimatedComplexity: {
        type: String,
        enum: ['low', 'medium', 'high'],
      },
      suggestedTechStack: {
        frontend: [String],
        backend: [String],
        database: [String],
      },
      recommendedFeatures: [String],
      scalabilityConsiderations: [String],
    },
    status: {
      type: String,
      enum: ['analyzing', 'completed', 'failed'],
      default: 'analyzing',
    },
    confidence: { type: Number, default: 0, min: 0, max: 100 },
    errors: [String],
  },
  { timestamps: true }
);

RequirementAnalysisSchema.index({ projectId: 1 });
RequirementAnalysisSchema.index({ userId: 1 });

export default mongoose.model<IRequirementAnalysis>('RequirementAnalysis', RequirementAnalysisSchema);
