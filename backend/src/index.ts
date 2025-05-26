// backend/src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { imageRouter } from './routes/images.js';
import { orderRouter } from './routes/orders.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    message: 'Orbital Edge API is running',
    endpoints: {
      images: '/api/images',
      orders: '/api/orders'
    },
    timestamp: new Date().toISOString()
  });
});

app.use('/api/images', imageRouter);
app.use('/api/orders', orderRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
    suggestedEndpoints: ['/api/images', '/api/orders']
  });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});