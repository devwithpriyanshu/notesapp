import mongoose from 'mongoose';
mongoose.set('strictQuery', false);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
    console.log(
      `\n MongoDB connected!! DB HOST: ${connectionInstance.connection.port}`
    );
  } catch (error) {
    console.log('MONGODB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;
