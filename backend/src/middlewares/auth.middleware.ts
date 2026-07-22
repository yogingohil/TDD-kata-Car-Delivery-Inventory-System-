import { Request, Response, NextFunction } from 'express';
import { JwtUtil } from '../utils/jwt.util.js';
import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';
import { UserRole } from '../constants/roles.enum.js';

export const authenticateJwt = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(
        'Authentication token required. Format: Bearer <token>',
        HttpStatus.UNAUTHORIZED,
      ),
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = JwtUtil.verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token', HttpStatus.UNAUTHORIZED));
  }
};

export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Unauthorized', HttpStatus.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('Forbidden: Insufficient privileges', HttpStatus.FORBIDDEN),
      );
    }

    next();
  };
};
