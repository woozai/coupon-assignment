import { Router } from 'express';
import { adminRouter } from './admin.routes.js';
import { authRouter } from './auth.routes.js';
import { healthRouter } from './health.routes.js';
import { resellerRouter } from './reseller.routes.js';

const rootRouter = Router();

// Keep route composition in one place so app setup stays small and predictable.
rootRouter.use(adminRouter);
rootRouter.use(authRouter);
rootRouter.use(healthRouter);
rootRouter.use(resellerRouter);

export { rootRouter };
