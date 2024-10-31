import mongoose from 'mongoose';
import dotenv from 'dotenv';

if (!process.env.MONGODB_URI) {
  const envFile =
    process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.local';
  dotenv.config({ path: envFile });
}

const mongoUri = process.env.MONGODB_URI;

export const connectDb = async () => {
  if (!mongoUri) {
    throw new Error('MONGODB_URI variable is not defined');
  }

  try {
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 20000,
      socketTimeoutMS: 45000,
    });
    console.log('Connected to mongodb successfuly');
  } catch (error) {
    console.log('error connecting to mongodb', error);
  }
};

export default connectDb;
