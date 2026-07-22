import { Router } from 'express';
import authRoutes from './auth.routes.js';
import vehicleRoutes from './vehicle.routes.js';
import purchaseRoutes from './purchase.routes.js';
import healthRoutes from './health.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/vehicles', vehicleRoutes);
router.use('/purchases', purchaseRoutes);

export default router;
