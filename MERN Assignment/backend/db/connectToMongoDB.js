// A file used to setup the secure database connection

import mongoose from 'mongoose';

const connectToMongoDB = async () => {
  try {
    const MONGO_URI = process.env.MONGO_DB_URI;

    if (!MONGO_URI) {
      throw new Error('MONGO_DB_URI not defined in environment variables.');
    }

    await mongoose.connect(MONGO_URI);

    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); 
  }
};

export default connectToMongoDB;
