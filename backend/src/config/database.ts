import mongoose from 'mongoose';

export async function connectDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-website-generator';
    
    await mongoose.connect(mongoUri, {
      retryWrites: true,
      w: 'majority',
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

export function disconnectDatabase() {
  return mongoose.disconnect();
}
