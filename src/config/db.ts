import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}${process.env.MONGODB_URI}`;
        await mongoose.connect(url);
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
