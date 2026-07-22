import { IPurchaseService } from '../interfaces/service.interface.js';
import { IPurchaseRepository, IVehicleRepository } from '../interfaces/repository.interface.js';
import { IPurchase } from '../interfaces/purchase.interface.js';
import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';

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
    _userId: string,
    _vehicleId: string,
    _quantity: number,
  ): Promise<IPurchase> {
    throw new AppError('Purchase service not implemented yet', HttpStatus.BAD_REQUEST);
  }

  public async getUserPurchases(_userId: string): Promise<IPurchase[]> {
    throw new AppError('Purchase service not implemented yet', HttpStatus.BAD_REQUEST);
  }
}
