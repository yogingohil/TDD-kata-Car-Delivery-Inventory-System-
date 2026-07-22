import { Router } from 'express';
import { TestDriveController } from '../controllers/testDrive.controller.js';
import { authenticateJwt, authorizeRoles } from '../middlewares/auth.middleware.js';
import { UserRole } from '../constants/roles.enum.js';
import { asyncHandler } from '../utils/async-handler.js';

const router = Router();
const controller = new TestDriveController();

router.use(authenticateJwt);

router.post('/', asyncHandler(controller.schedule));
router.get('/my', asyncHandler(controller.getUserAppointments));
router.get('/', authorizeRoles(UserRole.ADMIN), asyncHandler(controller.getAllAppointments));
router.patch('/:id/status', authorizeRoles(UserRole.ADMIN), asyncHandler(controller.updateStatus));

export default router;
