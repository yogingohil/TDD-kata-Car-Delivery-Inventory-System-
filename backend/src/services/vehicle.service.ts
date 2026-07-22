import { IVehicleService } from '../interfaces/service.interface.js';
import { IVehicleRepository } from '../interfaces/repository.interface.js';
import { IVehicle } from '../interfaces/vehicle.interface.js';
import { AppError } from '../utils/app-error.js';
import { HttpStatus } from '../constants/http-status.js';

export class VehicleService implements IVehicleService {
  constructor(private readonly vehicleRepository: IVehicleRepository) {}

  public getVehicleRepository(): IVehicleRepository {
    return this.vehicleRepository;
  }

  public async createVehicle(_data: Partial<IVehicle>): Promise<IVehicle> {
    throw new AppError('Vehicle service not implemented yet', HttpStatus.BAD_REQUEST);
  }

  public async getVehicleById(_id: string): Promise<IVehicle | null> {
    throw new AppError('Vehicle service not implemented yet', HttpStatus.BAD_REQUEST);
  }

  public async getAllVehicles(): Promise<IVehicle[]> {
    throw new AppError('Vehicle service not implemented yet', HttpStatus.BAD_REQUEST);
  }

  public async updateVehicle(_id: string, _data: Partial<IVehicle>): Promise<IVehicle | null> {
    throw new AppError('Vehicle service not implemented yet', HttpStatus.BAD_REQUEST);
  }

  public async deleteVehicle(_id: string): Promise<boolean> {
    throw new AppError('Vehicle service not implemented yet', HttpStatus.BAD_REQUEST);
  }
}
