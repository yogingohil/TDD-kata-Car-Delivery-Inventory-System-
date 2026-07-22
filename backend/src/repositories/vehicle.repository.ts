import { BaseRepository } from './base.repository.js';
import { IVehicle, IVehicleDocument } from '../interfaces/vehicle.interface.js';
import { IVehicleRepository } from '../interfaces/repository.interface.js';
import { VehicleModel } from '../models/vehicle.model.js';

export class VehicleRepository
  extends BaseRepository<IVehicleDocument>
  implements IVehicleRepository
{
  constructor() {
    super(VehicleModel);
  }

  public async updateQuantity(id: string, quantityChange: number): Promise<IVehicle | null> {
    return this.model
      .findByIdAndUpdate(id, { $inc: { quantity: quantityChange } }, { new: true })
      .lean<IVehicle>()
      .exec();
  }
}
