import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDatabase = async (): Promise<void> => {
  // Keep database startup in one place so server boot remains predictable.
  await mongoose.connect(env.MONGODB_URI);
};
