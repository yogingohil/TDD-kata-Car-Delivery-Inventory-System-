import { IAuthService } from '../interfaces/service.interface.js';
import { IUserRepository } from '../interfaces/repository.interface.js';
import { IUser } from '../interfaces/user.interface.js';
import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';

export class AuthService implements IAuthService {
  constructor(private readonly userRepository: IUserRepository) {}

  public getUserRepository(): IUserRepository {
    return this.userRepository;
  }

  public async register(
    _userData: Partial<IUser>,
  ): Promise<{ user: Partial<IUser>; token: string }> {
    // Architecture stub - Business logic to be implemented via TDD
    throw new AppError('Authentication logic not implemented yet', HttpStatus.BAD_REQUEST);
  }

  public async login(
    _email: string,
    _password: string,
  ): Promise<{ user: Partial<IUser>; token: string }> {
    // Architecture stub - Business logic to be implemented via TDD
    throw new AppError('Authentication logic not implemented yet', HttpStatus.BAD_REQUEST);
  }
}
