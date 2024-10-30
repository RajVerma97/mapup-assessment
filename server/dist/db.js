import mongoose from 'mongoose';
export const connectDb = async () => {
    const MONGODBURI = process.env.MONGODB_URI;
    try {
        await mongoose.connect(MONGODBURI);
        console.log('Connected to mongodb successfuly');
    }
    catch (error) {
        console.log('error connecting to mongodb', error);
    }
};
export default connectDb;
