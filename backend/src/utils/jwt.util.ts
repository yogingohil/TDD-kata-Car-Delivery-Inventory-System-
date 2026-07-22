import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import { UserRole } from '../constants/roles.enum.js';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export class JwtUtil {
  public static generateAccessToken(userId: string, email: string, role: UserRole): string {
    const payload = {
      sub: userId,
      email: email.toLowerCase(),
      role,
    };

    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as any,
    };

    return jwt.sign(payload, env.JWT_SECRET as Secret, options);
  }

  public static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;
  }

  // Prepared Architecture for Future Refresh Tokens
  public static generateRefreshToken(userId: string): string {
    const options: SignOptions = {
      expiresIn: '7d',
    };
    return jwt.sign({ sub: userId, type: 'refresh' }, env.JWT_SECRET as Secret, options);
  }
}
