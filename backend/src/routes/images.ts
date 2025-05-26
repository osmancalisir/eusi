// backend/src/routes/images.ts

import { Router } from 'express';
import { 
  getSatelliteImages, 
  searchImagesByGeoJSON,
  getImageDetails 
} from '../controllers/images.js';

const router = Router();

router.get('/', getSatelliteImages);
router.post('/search', searchImagesByGeoJSON);
router.get('/:catalogId', getImageDetails);

export const imageRouter = router;
