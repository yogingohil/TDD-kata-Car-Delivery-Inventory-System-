import { IPurchaseService } from '../interfaces/service.interface.js';
import { IPurchaseRepository, IVehicleRepository } from '../interfaces/repository.interface.js';
import { IPurchase } from '../interfaces/purchase.interface.js';
import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';
import { Types } from 'mongoose';

export class PurchaseService implements IPurchaseService {
  constructor(
    private readonly purchaseRepository: IPurchaseRepository,
    private readonly vehicleRepository: IVehicleRepository,
  ) {}

  public getRepositories() {
    return {
      purchaseRepository: this.purchaseRepository,
      vehicleRepository: this.vehicleRepository,
    };
  }

  public async processPurchase(
    userId: string,
    vehicleId: string,
    quantity: number,
  ): Promise<IPurchase> {
    if (quantity <= 0) {
      throw new AppError('Purchase quantity must be at least 1', HttpStatus.BAD_REQUEST);
    }

    const vehicle = await this.vehicleRepository.findById(vehicleId);
    if (!vehicle) {
      throw new AppError('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    if (vehicle.quantity === 0) {
      throw new AppError('Vehicle is currently out of stock', HttpStatus.BAD_REQUEST);
    }

    if (quantity > vehicle.quantity) {
      throw new AppError(
        `Insufficient inventory. Requested ${quantity}, but only ${vehicle.quantity} in stock.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const totalPrice = vehicle.price * quantity;

    const purchasePayload = {
      userId: new Types.ObjectId(userId) as any,
      vehicleId: new Types.ObjectId(vehicleId) as any,
      quantity,
      totalPrice,
      purchasedAt: new Date(),
    };

    const purchase = await this.purchaseRepository.create(purchasePayload);

    // Atomically decrease stock
    await this.vehicleRepository.updateQuantity(vehicleId, -quantity);

    return purchase;
  }

  public async getUserPurchases(userId: string): Promise<IPurchase[]> {
    return this.purchaseRepository.findByUserId(userId);
  }

  public async getAllPurchases(): Promise<IPurchase[]> {
    return this.purchaseRepository.findAllWithPopulate();
  }

  public async getAnalyticsSummary() {
    const [vehicles, purchases] = await Promise.all([
      this.vehicleRepository.findAll(),
      this.purchaseRepository.findAllWithPopulate(),
    ]);

    const totalVehicles = vehicles.length;
    const availableVehicles = vehicles.filter((v) => v.quantity > 3).length;
    const lowStockVehicles = vehicles.filter((v) => v.quantity > 0 && v.quantity <= 3).length;
    const outOfStockVehicles = vehicles.filter((v) => v.quantity === 0).length;
    const totalInventoryValue = vehicles.reduce((sum, v) => sum + v.price * v.quantity, 0);

    const categoryDistribution: Record<string, number> = {};
    vehicles.forEach((v) => {
      categoryDistribution[v.category] = (categoryDistribution[v.category] || 0) + v.quantity;
    });

    return {
      totalVehicles,
      availableVehicles,
      lowStockVehicles,
      outOfStockVehicles,
      totalInventoryValue,
      categoryDistribution,
      totalPurchasesCount: purchases.length,
    };
  }
}
