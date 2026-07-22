import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { AuthService } from '../services/auth.service.js';
import { UserRepository } from '../repositories/user.repository.js';
import { asyncHandler } from '../utils/async-handler.js';
import { validateRequest } from '../middlewares/validate.middleware.js';
import { authRateLimiter } from '../middlewares/rate-limiter.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';

const router = Router();

// Clean Architecture Dependency Injection Setup
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post(
  '/register',
  authRateLimiter,
  validateRequest(registerSchema),
  asyncHandler(authController.register),
);

router.post(
  '/login',
  authRateLimiter,
  validateRequest(loginSchema),
  asyncHandler(authController.login),
);

export default router;
