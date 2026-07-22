import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env.config.js';
import { UserRole } from '../constants/roles.enum.js';

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export class JwtUtil {
  public static generateToken(payload: JwtPayload): string {
    const options: SignOptions = {
      expiresIn: env.JWT_EXPIRES_IN as any,
    };
    return jwt.sign(payload, env.JWT_SECRET as Secret, options);
  }

  public static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;
  }
}
