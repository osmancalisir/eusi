// backend/src/routes/health.ts

import { Router } from 'express';
import { healthCheck } from '../controllers/health.js';

const router = Router();

router.get('/', healthCheck);

export const healthRouter = router;
