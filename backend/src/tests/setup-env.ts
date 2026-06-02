const ensureTestEnv = (key: string, fallbackValue: string): void => {
  if (!process.env[key]) {
    process.env[key] = fallbackValue;
  }
};

// Keep integration tests self-contained so they can import the app without a local .env file.
ensureTestEnv('ADMIN_EMAIL', 'admin@example.com');
ensureTestEnv(
  'ADMIN_PASSWORD_HASH',
  '$2b$10$O/1djS0WAv5vwzviKgpmd.XBkTaf8AvHaYDQ3YWOaDUgVPC7Bb/lK',
);
ensureTestEnv('CORS_ORIGIN', 'http://localhost:5173');
ensureTestEnv('JWT_EXPIRES_IN', '1h');
ensureTestEnv('JWT_SECRET', 'test-jwt-secret');
ensureTestEnv(
  'MONGODB_URI',
  'mongodb://127.0.0.1:27017/digital-coupon-marketplace-test',
);
ensureTestEnv('NODE_ENV', 'test');
ensureTestEnv('PORT', '4000');
ensureTestEnv('RESELLER_API_KEY', 'test-reseller-api-key');
