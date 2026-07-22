import { BaseRepository } from './base.repository.js';
import { IPurchase, IPurchaseDocument } from '../interfaces/purchase.interface.js';
import { IPurchaseRepository } from '../interfaces/repository.interface.js';
import { PurchaseModel } from '../models/purchase.model.js';

export class PurchaseRepository
  extends BaseRepository<IPurchaseDocument>
  implements IPurchaseRepository
{
  constructor() {
    super(PurchaseModel);
  }

  public async findByUserId(userId: string): Promise<IPurchase[]> {
    return this.model
      .find({ userId })
      .populate('vehicleId')
      .sort({ purchasedAt: -1 })
      .lean<IPurchase[]>()
      .exec();
  }
}
