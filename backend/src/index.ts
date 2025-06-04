// backend/src/index.ts

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { imageRouter } from './routes/images.js';
import { orderRouter } from './routes/orders.js';
import { healthRouter } from './routes/health.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  
  if (req.method === 'POST' && req.path.includes('/search')) {
    console.log('Request body:', JSON.stringify(req.body));
  }
  
  next();
});

app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    message: 'Orbital Edge API is running',
    endpoints: {
      images: '/api/images',
      orders: '/api/orders',
      health: '/health'
    },
    timestamp: new Date().toISOString()
  });
});

app.use('/api/images', imageRouter);
app.use('/api/orders', orderRouter);
app.use('/health', healthRouter);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} does not exist`,
    suggestedEndpoints: ['/api/images', '/api/orders', '/health']
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });
  
  // In production, any production related information should be avoided to share
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Please try again later',
    ...(process.env.NODE_ENV === 'development' && { 
      details: {
        code: err.code,
        stack: err.stack
      }
    })
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 http://localhost:${PORT}`);
  console.log(`🩺 Health endpoint: http://localhost:${PORT}/health`);
});
