// backend/src/routes/images.ts

import { Router } from 'express';
import { getSatelliteImages } from '../controllers/images.js';

const router = Router();

router.get('/', getSatelliteImages);

export const imageRouter = router;
