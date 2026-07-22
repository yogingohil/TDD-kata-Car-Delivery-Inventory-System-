import { IVehicleService } from '../interfaces/service.interface.js';
import { IVehicleRepository } from '../interfaces/repository.interface.js';
import { IVehicle, VehicleStatus } from '../interfaces/vehicle.interface.js';
import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';

export class VehicleService implements IVehicleService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  public getVehicleRepository(): IVehicleRepository {
    return this.vehicleRepository;
  }

  public async createVehicle(data: Partial<IVehicle>): Promise<IVehicle> {
    if (!data.vin) {
      throw new AppError('VIN is required', HttpStatus.BAD_REQUEST);
    }

    const existingVin = await this.vehicleRepository.findByVin(data.vin);
    if (existingVin) {
      throw new AppError('Vehicle with this VIN already exists', HttpStatus.CONFLICT);
    }

    const quantity = data.quantity !== undefined ? data.quantity : 1;
    let status = VehicleStatus.AVAILABLE;
    if (quantity === 0) {
      status = VehicleStatus.OUT_OF_STOCK;
    } else if (quantity <= 3) {
      status = VehicleStatus.LOW_STOCK;
    }

    const vehiclePayload = {
      ...data,
      vin: data.vin.toUpperCase().trim(),
      quantity,
      status: data.status || status,
    };

    return this.vehicleRepository.create(vehiclePayload);
  }

  public async getVehicleById(id: string): Promise<IVehicle> {
    const vehicle = await this.vehicleRepository.findById(id);
    if (!vehicle) {
      throw new AppError('Vehicle not found', HttpStatus.NOT_FOUND);
    }
    return vehicle;
  }

  public async getAllVehicles(options: Record<string, unknown> = {}) {
    return this.vehicleRepository.findWithFilters(options);
  }

  public async updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle> {
    const existingVehicle = await this.vehicleRepository.findById(id);
    if (!existingVehicle) {
      throw new AppError('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    if (data.vin && data.vin.toUpperCase().trim() !== existingVehicle.vin) {
      const vinCheck = await this.vehicleRepository.findByVin(data.vin);
      if (vinCheck) {
        throw new AppError('Vehicle with this VIN already exists', HttpStatus.CONFLICT);
      }
    }

    let updatedQuantity = existingVehicle.quantity;
    if (data.quantity !== undefined) {
      updatedQuantity = data.quantity;
    }

    let status = existingVehicle.status || VehicleStatus.AVAILABLE;
    if (data.quantity !== undefined) {
      if (updatedQuantity === 0) {
        status = VehicleStatus.OUT_OF_STOCK;
      } else if (updatedQuantity <= 3) {
        status = VehicleStatus.LOW_STOCK;
      } else {
        status = VehicleStatus.AVAILABLE;
      }
    }

    const updatePayload = {
      ...data,
      ...(data.vin && { vin: data.vin.toUpperCase().trim() }),
      ...(data.quantity !== undefined && { status }),
    };

    const updated = await this.vehicleRepository.update(id, updatePayload);
    if (!updated) {
      throw new AppError('Vehicle update failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return updated;
  }

  public async deleteVehicle(id: string): Promise<boolean> {
    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new AppError('Vehicle not found', HttpStatus.NOT_FOUND);
    }
    return this.vehicleRepository.delete(id);
  }

  public async restockVehicle(id: string, restockQuantity: number): Promise<IVehicle> {
    if (restockQuantity <= 0) {
      throw new AppError('Restock quantity must be positive', HttpStatus.BAD_REQUEST);
    }

    const existing = await this.vehicleRepository.findById(id);
    if (!existing) {
      throw new AppError('Vehicle not found', HttpStatus.NOT_FOUND);
    }

    const updated = await this.vehicleRepository.updateQuantity(id, restockQuantity);
    if (!updated) {
      throw new AppError('Failed to restock vehicle', HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return updated;
  }
}
