import { Router } from 'express';
import { healthRouter } from './health.routes.js';
import { resellerRouter } from './reseller.routes.js';

const rootRouter = Router();

// Keep route composition in one place so app setup stays small and predictable.
rootRouter.use(healthRouter);
rootRouter.use(resellerRouter);

export { rootRouter };
