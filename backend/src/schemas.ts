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
  coordinates: z.any() // z.array(z.array(z.array(z.number())) instead of "z.any" to have 3D array validation?
}).passthrough();

export const OrderSchema = z.object({
  catalogId: z.string().min(10)
});

export const OrderFilterSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  imageId: z.string().optional()
});

/**
 * Here, the Zod validates twice for both frontend and backend
 * This will create defense-in-depth, with the cost of <2kb more packaging
 * Which is minimal with Zod's tree-shaking 
 * 
 * Frontend part: frontend/src/components/GeoJsonUploadPanel.tsx file, processGeoJson() function, line 49 and line 64
 * Backend part: backend/src/controllers/images.ts file, searchImagesByGeoJSON() function, line 51 and line 73
 */