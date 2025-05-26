// backend/src/schemas.ts

import { z } from 'zod';

export const ImageFilterSchema = z.object({
  minResolution: z.number().optional(),
  maxCloudCoverage: z.number().optional(),
  bbox: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/).optional()
});

export const OrderSchema = z.object({
  imageId: z.number().int().positive()
});
