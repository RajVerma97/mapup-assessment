import mongoose from 'mongoose';

const connectDb = async () => {
  const MONGODBURI = process.env.MONGODB_URI as string;
  try {
    await mongoose.connect(MONGODBURI);
    console.log('Connected to mongodb successfuly');
  } catch (error) {
    console.log('error connecting to mongodb', error);
  }
};

export default connectDb;
