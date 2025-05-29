// backend/src/controllers/images.ts

import { Request, Response, NextFunction } from 'express';
import { query } from '../db.js';
import { ImageFilterSchema, GeoJSONSchema } from '../schemas.js';
import type { Feature, Geometry } from 'geojson';

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

    console.log('Executing image search query:', sql, params);
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Image search error:', error);
    next(error);
  }
};

export const searchImagesByGeoJSON = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    console.log('Received GeoJSON search request:', req.body);
    
    const validation = GeoJSONSchema.safeParse(req.body);
    if (!validation.success) {
      console.error('GeoJSON validation failed:', validation.error.errors);
      res.status(400).json({
        error: 'Invalid GeoJSON input',
        details: validation.error.errors.map(e => ({
          path: e.path.join('.'),
          message: e.message
        }))
      });
      return;
    }

    const geometry = validation.data;
    console.log('Validated GeoJSON geometry:', JSON.stringify(geometry));
    
    const result = await query(
      `SELECT 
        id,
        catalog_id AS "catalogID",
        acquisition_date_start AS "acquisitionDateStart",
        acquisition_date_end AS "acquisitionDateEnd",
        resolution,
        cloud_coverage AS "cloudCoverage",
        off_nadir AS "offNadir",
        sensor,
        scan_direction AS "scanDirection",
        satellite_elevation AS "satelliteElevation",
        image_bands AS "imageBands",
        ST_AsGeoJSON(geometry)::json AS geometry
       FROM satellite_images 
       WHERE ST_Intersects(
         geometry, 
         ST_SetSRID(ST_GeomFromGeoJSON($1), 4326)::geography
       )`,
      [JSON.stringify(geometry)]
    );
    
    console.log(`Found ${result.rows.length} matching images`);
    res.json(result.rows);
  } catch (error: any) {
    console.error('GeoJSON search error:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    
    res.status(500).json({ 
      error: 'Internal Server Error',
      message: 'Failed to process spatial query',
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message 
      })
    });
  }
};

export const getAllSatelliteImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await query('SELECT * FROM satellite_images');
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
