import app from './app.js';
import { connectDatabase } from './config/database.js';
import { env } from './config/env.js';

const startServer = async (): Promise<void> => {
  await connectDatabase();

  app.listen(env.PORT, () => {
    console.log(`Backend server listening on http://localhost:${env.PORT}`);
  });
};

startServer().catch((error: unknown) => {
  console.error('Failed to start backend server.', error);
  process.exit(1);
});
