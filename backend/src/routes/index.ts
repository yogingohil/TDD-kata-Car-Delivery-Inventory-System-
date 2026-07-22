import { Router } from 'express';
import authRoutes from './auth.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import purchaseRoutes from './purchase.routes.js';
import testDriveRoutes from './testDrive.routes.js';
import { authenticateJwt } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'Car Inventory System API',
    timestamp: new Date().toISOString(),
  });
});

router.get('/health/protected-example', authenticateJwt, (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    message: 'Access granted to protected example route',
  });
});

router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/purchases', purchaseRoutes);
router.use('/test-drives', testDriveRoutes);

export default router;
