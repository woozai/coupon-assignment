import { Router } from 'express';

const router = Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'Healthy' });
});

export default router;
