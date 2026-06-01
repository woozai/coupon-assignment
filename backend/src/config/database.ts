import mongoose from 'mongoose';
import { env } from './env.js';

// Connect to MongoDB using the configured URI.
// This helper is intentionally simple so the app can call it once at startup.
export const connectDatabase = async (): Promise<void> => {
  await mongoose.connect(env.MONGODB_URI);
  console.log('MongoDB connected');
};
