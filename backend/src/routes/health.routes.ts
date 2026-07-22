import { Router, Request, Response } from 'express';
import { HttpStatus } from '../constants/http-status.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';
import { ApiResponse } from '../utils/response.util.js';

const router = Router();

router.get('/', (_req: Request, res: Response) => {
  res.status(HttpStatus.OK).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Car Inventory System API',
  });
});

router.get('/protected-example', authenticateJwt, (req: Request, res: Response) => {
  ApiResponse.success(res, HttpStatus.OK, 'Protected health check route accessed', {
    user: req.user,
  });
});

export default router;
