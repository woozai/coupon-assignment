import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';
import { rootRouter } from './routes/index.js';

const app = express();

// Register shared app middleware before feature routes are added.
app.use(
  cors({
    origin: env.CORS_ORIGIN,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware);
app.use(rootRouter);

// Keep fallback handlers last so they only run when no route handled the request.
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
