// backend/src/controllers/health.ts

import { Request, Response } from 'express';
import { query } from '../db.js';

export const healthCheck = async (req: Request, res: Response) => {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    checks: {
      database: { status: 'down', responseTime: 0, message: '' },
      api: { status: 'up', responseTime: 0 }
    }
  };

  const startTime = Date.now();
  
  try {
    const dbStart = Date.now();
    await query('SELECT NOW()');
    const dbTime = Date.now() - dbStart;
    
    healthCheck.checks.database = {
      status: 'up',
      responseTime: dbTime,
      message: 'Database connection successful'
    };
  } catch (err: any) {
    healthCheck.checks.database = {
      status: 'down',
      responseTime: 0,
      message: err.message,
    };
    healthCheck.status = 'unhealthy';
  }

  healthCheck.checks.api.responseTime = Date.now() - startTime;

  const allHealthy = Object.values(healthCheck.checks).every(
    check => check.status === 'up'
  );
  healthCheck.status = allHealthy ? 'healthy' : 'unhealthy';

  res.status(allHealthy ? 200 : 503).json(healthCheck);
};
