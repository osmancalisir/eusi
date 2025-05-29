// backend/src/schemas.ts

import { z } from 'zod';

export const ImageFilterSchema = z.object({
  minResolution: z.coerce.number().optional(),
  maxCloudCoverage: z.coerce.number().optional(),
  bbox: z.string().regex(/^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/).optional()
});

export const GeoJSONSchema = z.object({
  type: z.enum([
    "Point", "LineString", "Polygon", 
    "MultiPoint", "MultiLineString", "MultiPolygon"
  ]),
  coordinates: z.any()
}).passthrough();

export const OrderSchema = z.object({
  catalogId: z.string().min(10)
});

export const OrderFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  imageId: z.string().optional()
});
