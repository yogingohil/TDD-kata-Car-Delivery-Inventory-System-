import { Request, Response } from 'express';
import { IAuthService } from '../interfaces/service.interface.js';
import { HttpStatus } from '../constants/http-status.js';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  public getAuthService(): IAuthService {
    return this.authService;
  }

  public register = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.register(req.body);
    res.status(HttpStatus.CREATED).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.authService.login(req.body.email, req.body.password);
    res.status(HttpStatus.OK).json({
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  };
}
