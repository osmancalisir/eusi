// backend/src/schemas.ts

import { z } from 'zod';

export const ImageFilterSchema = z.object({
  minResolution: z.coerce.number().optional(),
  maxCloudCoverage: z.coerce.number().optional(),
  bbox: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/).optional()
});

export const GeoJSONSchema = z.object({
  type: z.literal("Polygon"),
  coordinates: z.array(z.array(z.tuple([z.number(), z.number()])))
});

export const OrderSchema = z.object({
  catalogId: z.string().min(10)
});
