import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🔥 Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB', error);
  }
};
