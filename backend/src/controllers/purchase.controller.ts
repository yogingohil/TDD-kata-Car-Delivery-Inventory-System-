import { Request, Response } from 'express';
import { PurchaseService } from '../services/purchase.service.js';
import { HttpStatus } from '../constants/http-status.js';
import { ApiResponse } from '../utils/response.util.js';
import { AppError } from '../utils/app-error.js';

export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  public processPurchase = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.sub;
    if (!userId) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const vehicleId = req.params.id as string;
    const quantity = req.body.quantity || 1;

    const purchase = await this.purchaseService.processPurchase(userId, vehicleId, quantity);
    ApiResponse.success(res, HttpStatus.CREATED, 'Vehicle purchased successfully', purchase);
  };

  public getUserPurchases = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.sub;
    if (!userId) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    const purchases = await this.purchaseService.getUserPurchases(userId);
    ApiResponse.success(res, HttpStatus.OK, 'Purchase history retrieved successfully', purchases);
  };

  public getAllPurchases = async (_req: Request, res: Response): Promise<void> => {
    const purchases = await this.purchaseService.getAllPurchases();
    ApiResponse.success(res, HttpStatus.OK, 'All customer purchases retrieved', purchases);
  };

  public getAnalytics = async (_req: Request, res: Response): Promise<void> => {
    const analytics = await this.purchaseService.getAnalyticsSummary();
    ApiResponse.success(res, HttpStatus.OK, 'Analytics summary retrieved successfully', analytics);
  };
}
