import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/service.interface.js';
import { HttpStatus } from '../constants/http-status.js';
import { ApiResponse } from '../utils/response.util.js';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  public getAuthService(): IAuthService {
    return this.authService;
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);
    ApiResponse.success(
      res,
      HttpStatus.CREATED,
      'User registered successfully',
      result,
    );
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body.email, req.body.password);
    ApiResponse.success(res, HttpStatus.OK, 'Login successful', result);
  };
}
