import express from 'express';
import { errorMiddleware } from './middlewares/error.middleware.js';
import { notFoundMiddleware } from './middlewares/not-found.middleware.js';
import { requestLoggerMiddleware } from './middlewares/request-logger.middleware.js';

const app = express();

// Register shared app middleware before feature routes are added.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware);

app.get('/health', (_request, response) => {
  response.status(200).json({ status: 'ok' });
});

// Keep fallback handlers last so they only run when no route handled the request.
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
