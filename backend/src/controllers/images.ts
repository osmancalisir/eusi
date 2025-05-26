// backend/src/controllers/images.ts

import { Request, Response, NextFunction } from 'express';
import { query } from '../db.js';
import { z } from 'zod';

const BboxSchema = z.string().regex(
  /^-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?,-?\d+(\.\d+)?$/
);

export const getSatelliteImages = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validationResult = BboxSchema.safeParse(req.query.bbox);
    if (!validationResult.success) {
      res.status(400).json({
        error: 'Invalid bbox format',
        details: validationResult.error.errors
      });
      return;
    }

    const { bbox } = req.query;
    let sql = 'SELECT * FROM satellite_images';
    const params = [];

    if (bbox) {
      const [minLon, minLat, maxLon, maxLat] = (bbox as string).split(',').map(parseFloat);
      sql += ` WHERE ST_Intersects(geometry, ST_MakeEnvelope($1, $2, $3, $4, 4326))`;
      params.push(minLon, minLat, maxLon, maxLat);
    }

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};