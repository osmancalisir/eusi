// backend/src/controllers/orders.ts

import { Request, Response, NextFunction } from 'express';
import { query } from '../db.js';
import { OrderSchema, OrderFilterSchema } from '../schemas.js';

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

    const { catalogId } = validation.data;
    const imageCheck = await query(
      'SELECT catalog_id FROM satellite_images WHERE catalog_id = $1',
      [catalogId]
    );
    
    if (imageCheck.rows.length === 0) {
      res.status(404).json({ error: 'Satellite image not found' });
      return;
    }

    const result = await query(
      'INSERT INTO orders (image_id) VALUES ($1) RETURNING *',
      [catalogId]
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
    const filters = OrderFilterSchema.parse(req.query);
    
    let sql = `
      SELECT 
        orders.id, 
        orders.order_date,
        orders.image_id,
        satellite_images.catalog_id as "catalogID",
        satellite_images.resolution
      FROM orders
      INNER JOIN satellite_images ON orders.image_id = satellite_images.catalog_id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters.imageId) {
      sql += ` AND satellite_images.catalog_id = $${params.length + 1}`;
      params.push(filters.imageId);
    }

    if (filters.startDate) {
      sql += ` AND orders.order_date >= $${params.length + 1}`;
      params.push(filters.startDate);
    }

    if (filters.endDate) {
      sql += ` AND orders.order_date <= $${params.length + 1}`;
      params.push(filters.endDate);
    }

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error in getOrders:', error);
    next(error);
  }
};
