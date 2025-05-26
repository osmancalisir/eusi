// backend/src/controllers/images.ts

import { Request, Response, NextFunction } from 'express';
import { query } from '../db.js';
import { ImageFilterSchema, GeoJSONSchema } from '../schemas.js';

export const getSatelliteImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const filters = ImageFilterSchema.parse(req.query);
    
    let sql = 'SELECT * FROM satellite_images WHERE 1=1';
    const params = [];

    if (filters.minResolution !== undefined) {
      sql += ` AND resolution >= $${params.length + 1}`;
      params.push(filters.minResolution);
    }

    if (filters.maxCloudCoverage !== undefined) {
      sql += ` AND cloud_coverage <= $${params.length + 1}`;
      params.push(filters.maxCloudCoverage);
    }

    if (filters.bbox) {
      const [minLon, minLat, maxLon, maxLat] = filters.bbox.split(',').map(parseFloat);
      sql += ` AND ST_Intersects(geometry, ST_MakeEnvelope($${params.length + 1}, $${params.length + 2}, $${params.length + 3}, $${params.length + 4}, 4326))`;
      params.push(minLon, minLat, maxLon, maxLat);
    }

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const searchImagesByGeoJSON = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = GeoJSONSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Invalid GeoJSON',
        details: validation.error.errors
      });
      return;
    }

    const result = await query(
      `SELECT * FROM satellite_images 
       WHERE ST_Intersects(
         geometry, 
         ST_GeomFromGeoJSON($1)
       )`,
      [JSON.stringify(req.body)]
    );
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};

export const getImageDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { catalogId } = req.params;
    const result = await query(
      'SELECT * FROM satellite_images WHERE catalog_id = $1',
      [catalogId]
    );
    
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};
