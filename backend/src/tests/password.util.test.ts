import { PasswordUtil } from '../utils/password.util.js';

describe('PasswordUtil Unit Tests', () => {
  const rawPassword = 'Password123!';

  it('should hash password into a secure bcrypt hash string', async () => {
    const hashedPassword = await PasswordUtil.hashPassword(rawPassword);

    expect(hashedPassword).not.toBe(rawPassword);
    expect(hashedPassword.startsWith('$2')).toBe(true);
  });

  it('should return true when comparing matching password and hash', async () => {
    const hashedPassword = await PasswordUtil.hashPassword(rawPassword);
    const isValid = await PasswordUtil.comparePassword(rawPassword, hashedPassword);

    expect(isValid).toBe(true);
  });

  it('should return false when comparing non-matching password and hash', async () => {
    const hashedPassword = await PasswordUtil.hashPassword(rawPassword);
    const isValid = await PasswordUtil.comparePassword('WrongPassword123!', hashedPassword);

    expect(isValid).toBe(false);
  });
});
