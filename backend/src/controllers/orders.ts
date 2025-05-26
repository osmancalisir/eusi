// backend/src/controllers/orders.ts

import { Request, Response, NextFunction } from 'express';
import { query } from '../db.js';
import { z } from 'zod';

const OrderSchema = z.object({
  imageId: z.number().int().positive()
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const validation = OrderSchema.safeParse(req.body);
    if (!validation.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: validation.error.errors
      });
      return;
    }

    const { imageId } = validation.data;
    const imageCheck = await query(
      'SELECT id FROM satellite_images WHERE id = $1',
      [imageId]
    );
    
    if (imageCheck.rows.length === 0) {
      res.status(404).json({ error: 'Satellite image not found' });
      return;
    }

    const result = await query(
      'INSERT INTO orders (image_id) VALUES ($1) RETURNING *',
      [imageId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
};

export const getOrders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await query(`
      SELECT orders.*, satellite_images.catalog_id, satellite_images.resolution 
      FROM orders
      JOIN satellite_images ON orders.image_id = satellite_images.id
    `);
    
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
};