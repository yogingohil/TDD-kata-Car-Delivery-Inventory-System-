import { IAuthService } from '../interfaces/service.interface.js';
import { IUserRepository } from '../interfaces/repository.interface.js';
import { IUser } from '../interfaces/user.interface.js';
import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';
import { PasswordUtil } from '../utils/password.util.js';
import { JwtUtil } from '../utils/jwt.util.js';
import { UserRole } from '../constants/roles.enum.js';
import { env } from '../config/env.config.js';

export interface AuthResultPayload {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: Date;
  };
  accessToken: string;
  expiresIn: string;
}

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  public getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  public async register(userData: Partial<IUser>): Promise<AuthResultPayload> {
    const { name, email, password, role: requestedRole } = userData;

    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', HttpStatus.BAD_REQUEST);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      throw new AppError('Email is already registered', HttpStatus.CONFLICT);
    }

    const hashedPassword = await PasswordUtil.hashPassword(password);

    // Public registration defaults strictly to USER role unless pre-approved admin email
    let assignedRole = UserRole.USER;
    if (
      (requestedRole === UserRole.ADMIN || requestedRole === ('ADMIN' as any)) &&
      (normalizedEmail === 'admin@example.com' || normalizedEmail.endsWith('@apexmotors.com'))
    ) {
      assignedRole = UserRole.ADMIN;
    } else if (normalizedEmail === 'admin@example.com' || normalizedEmail.endsWith('@apexmotors.com')) {
      assignedRole = UserRole.ADMIN;
    }

    const createdUser = await this.userRepository.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: assignedRole,
    });

    const userId = createdUser._id ? createdUser._id.toString() : '';

    const accessToken = JwtUtil.generateAccessToken(
      userId,
      createdUser.email,
      createdUser.role,
    );

    return {
      user: this.sanitizeUser(createdUser),
      accessToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  public async login(email: string, password: string): Promise<AuthResultPayload> {
    if (!email || !password) {
      throw new AppError('Email and password are required', HttpStatus.BAD_REQUEST);
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await this.userRepository.findByEmail(normalizedEmail);
    if (!user || !user.password) {
      throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await PasswordUtil.comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', HttpStatus.UNAUTHORIZED);
    }

    const userId = user._id ? user._id.toString() : '';

    const accessToken = JwtUtil.generateAccessToken(userId, user.email, user.role);

    return {
      user: this.sanitizeUser(user),
      accessToken,
      expiresIn: env.JWT_EXPIRES_IN,
    };
  }

  private sanitizeUser(user: IUser) {
    return {
      id: user._id ? user._id.toString() : '',
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.createdAt && { createdAt: user.createdAt }),
    };
  }
}
