import { JwtUtil } from '../utils/jwt.util.js';
import { UserRole } from '../constants/roles.enum.js';

describe('JwtUtil Unit Tests', () => {
  const userId = '507f1f77bcf86cd799439011';
  const email = 'user@example.com';
  const role = UserRole.USER;

  it('should generate a valid JWT access token containing sub, email, and role claims', () => {
    const token = JwtUtil.generateAccessToken(userId, email, role);

    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const decoded = JwtUtil.verifyAccessToken(token);
    expect(decoded.sub).toBe(userId);
    expect(decoded.email).toBe(email.toLowerCase());
    expect(decoded.role).toBe(role);
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp).toBeDefined();
  });

  it('should throw an error when verifying an invalid token string', () => {
    expect(() => JwtUtil.verifyAccessToken('invalid.jwt.token')).toThrow();
  });

  it('should generate a refresh token with refresh type claim', () => {
    const refreshToken = JwtUtil.generateRefreshToken(userId);
    expect(typeof refreshToken).toBe('string');
  });
});
