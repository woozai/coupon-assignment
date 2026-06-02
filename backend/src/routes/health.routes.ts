import { Router } from 'express';
import { getHealthController } from '../controllers/health.controller.js';

const healthRouter = Router();

healthRouter.get('/health', getHealthController);

export { healthRouter };
