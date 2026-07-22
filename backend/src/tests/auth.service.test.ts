import { AuthService } from '../services/auth.service.js';
import { IUserRepository } from '../interfaces/repository.interface.js';
import { IUser } from '../interfaces/user.interface.js';
import { AppError } from '../utils/app-error.js';
import { UserRole } from '../constants/roles.enum.js';
import { Types } from 'mongoose';

describe('AuthService Unit Tests with Mocks', () => {
  let authService: AuthService;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    authService = new AuthService(mockUserRepository);
  });

  describe('register', () => {
    it('should throw AppError 409 if email is already registered', async () => {
      mockUserRepository.findByEmail.mockResolvedValue({
        _id: new Types.ObjectId(),
        name: 'Existing',
        email: 'existing@example.com',
        role: UserRole.USER,
      } as IUser);

      await expect(
        authService.register({
          name: 'John',
          email: 'existing@example.com',
          password: 'Password123!',
        }),
      ).rejects.toThrow(AppError);
    });

    it('should successfully register user when email is unique', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockUserRepository.create.mockImplementation(async (data) => ({
        _id: new Types.ObjectId(),
        name: data.name!,
        email: data.email!,
        role: UserRole.USER,
        createdAt: new Date(),
      } as IUser));

      const result = await authService.register({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result.user.email).toBe('john@example.com');
      expect(result.user).not.toHaveProperty('password');
    });
  });

  describe('login', () => {
    it('should throw AppError 401 if user does not exist', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authService.login('unknown@example.com', 'Password123!'),
      ).rejects.toThrow(AppError);
    });
  });
});
