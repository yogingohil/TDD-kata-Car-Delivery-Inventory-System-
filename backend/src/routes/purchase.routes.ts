import { Router } from 'express';
import { PurchaseController } from '../controllers/purchase.controller.js';
import { PurchaseService } from '../services/purchase.service.js';
import { PurchaseRepository } from '../repositories/purchase.repository.js';
import { VehicleRepository } from '../repositories/vehicle.repository.js';
import { asyncHandler } from '../utils/async-handler.js';
import { authenticateJwt, authorizeRoles } from '../middlewares/auth.middleware.js';
import { UserRole } from '../constants/roles.enum.js';

const router = Router();

const vehicleRepository = new VehicleRepository();
const purchaseRepository = new PurchaseRepository();
const purchaseService = new PurchaseService(purchaseRepository, vehicleRepository);
const purchaseController = new PurchaseController(purchaseService);

router.get('/my', authenticateJwt, asyncHandler(purchaseController.getUserPurchases));

router.get(
  '/',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(purchaseController.getAllPurchases),
);

router.get(
  '/analytics/summary',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(purchaseController.getAnalytics),
);

export default router;
