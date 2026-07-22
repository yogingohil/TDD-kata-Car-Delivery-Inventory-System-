import { Router, Request, Response } from 'express';
import { HttpStatus } from '../constants/http-status.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Car Inventory System API',
  });
});

export default router;
