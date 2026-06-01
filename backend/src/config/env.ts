import dotenv from 'dotenv';

dotenv.config();

const getRequiredEnv = (key: string): string => {
  const environmentValue = process.env[key];

  if (!environmentValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return environmentValue;
};

export interface AppEnv {
  CORS_ORIGIN: string;
  MONGODB_URI: string;
  NODE_ENV: string;
  PORT: number;
  RESELLER_API_TOKEN: string;
}

export const env: AppEnv = {
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  MONGODB_URI: getRequiredEnv('MONGODB_URI'),
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: Number(process.env.PORT ?? 4000),
  RESELLER_API_TOKEN: getRequiredEnv('RESELLER_API_TOKEN'),
};
