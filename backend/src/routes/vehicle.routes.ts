import { Router } from 'express';
import { VehicleController } from '../controllers/vehicle.controller.js';
import { VehicleService } from '../services/vehicle.service.js';
import { VehicleRepository } from '../repositories/vehicle.repository.js';
import { PurchaseService } from '../services/purchase.service.js';
import { PurchaseRepository } from '../repositories/purchase.repository.js';
import { PurchaseController } from '../controllers/purchase.controller.js';
import { asyncHandler } from '../utils/async-handler.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authenticateJwt, authorizeRoles } from '../middlewares/auth.middleware.js';
import { UserRole } from '../constants/roles.enum.js';
import {
  createVehicleSchema,
  updateVehicleSchema,
  restockVehicleSchema,
  queryVehicleSchema,
} from '../validators/vehicle.validator.js';
import { createPurchaseSchema } from '../validators/purchase.validator.js';

const router = Router();

const vehicleRepository = new VehicleRepository();
const vehicleService = new VehicleService(vehicleRepository);
const vehicleController = new VehicleController(vehicleService);

const purchaseRepository = new PurchaseRepository();
const purchaseService = new PurchaseService(purchaseRepository, vehicleRepository);
const purchaseController = new PurchaseController(purchaseService);

// Public Routes
router.get('/', validateRequest(queryVehicleSchema), asyncHandler(vehicleController.getAllVehicles));
router.get('/:id', asyncHandler(vehicleController.getVehicleById));

// Protected Routes (User & Admin)
router.post(
  '/:id/purchase',
  authenticateJwt,
  validateRequest(createPurchaseSchema),
  asyncHandler(purchaseController.processPurchase),
);

// Protected Admin Routes
router.post(
  '/',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(createVehicleSchema),
  asyncHandler(vehicleController.createVehicle),
);

router.put(
  '/:id',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(updateVehicleSchema),
  asyncHandler(vehicleController.updateVehicle),
);

router.delete(
  '/:id',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  asyncHandler(vehicleController.deleteVehicle),
);

router.post(
  '/:id/restock',
  authenticateJwt,
  authorizeRoles(UserRole.ADMIN),
  validateRequest(restockVehicleSchema),
  asyncHandler(vehicleController.restockVehicle),
);

export default router;
