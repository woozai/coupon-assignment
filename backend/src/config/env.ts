import dotenv from 'dotenv';

dotenv.config();

type AppNodeEnv = 'development' | 'test' | 'production';

const getRequiredEnv = (key: string): string => {
  const environmentValue = process.env[key];

  if (!environmentValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return environmentValue;
};

const getNodeEnv = (): AppNodeEnv => {
  const environmentValue = process.env.NODE_ENV ?? 'development';

  if (
    environmentValue === 'development' ||
    environmentValue === 'test' ||
    environmentValue === 'production'
  ) {
    return environmentValue;
  }

  throw new Error(
    'Invalid NODE_ENV value. Expected development, test, or production.',
  );
};

const getPort = (): number => {
  const rawPortValue = process.env.PORT ?? '4000';
  const parsedPort = Number(rawPortValue);

  if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
    throw new Error('Invalid PORT value. Expected a positive integer.');
  }

  return parsedPort;
};

export interface AppEnv {
  ADMIN_EMAIL: string;
  ADMIN_PASSWORD_HASH: string;
  CORS_ORIGIN: string;
  JWT_EXPIRES_IN: string;
  JWT_SECRET: string;
  MONGODB_URI: string;
  NODE_ENV: AppNodeEnv;
  PORT: number;
}

// Centralize env parsing so the rest of the app can rely on typed config values.
export const env: AppEnv = {
  ADMIN_EMAIL: getRequiredEnv('ADMIN_EMAIL'),
  ADMIN_PASSWORD_HASH: getRequiredEnv('ADMIN_PASSWORD_HASH'),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? '1h',
  JWT_SECRET: getRequiredEnv('JWT_SECRET'),
  MONGODB_URI: getRequiredEnv('MONGODB_URI'),
  NODE_ENV: getNodeEnv(),
  PORT: getPort(),
};
