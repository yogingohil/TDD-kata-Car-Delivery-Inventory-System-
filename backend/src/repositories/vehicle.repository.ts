import { BaseRepository } from './base.repository.js';
import { IVehicle, IVehicleDocument, VehicleStatus } from '../interfaces/vehicle.interface.js';
import { IVehicleRepository } from '../interfaces/repository.interface.js';
import { VehicleModel } from '../models/vehicle.model.js';

export interface VehicleQueryOptions {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  make?: string;
  fuelType?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedVehiclesResult {
  vehicles: IVehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class VehicleRepository
  extends BaseRepository<IVehicleDocument>
  implements IVehicleRepository
{
  constructor() {
    super(VehicleModel);
  }

  public async findByVin(vin: string): Promise<IVehicle | null> {
    return this.model.findOne({ vin: vin.toUpperCase().trim() }).lean<IVehicle>().exec();
  }

  public async findWithFilters(options: VehicleQueryOptions): Promise<PaginatedVehiclesResult> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.max(1, Math.min(100, options.limit || 10));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};

    if (options.search) {
      filter.$or = [
        { make: { $regex: options.search, $options: 'i' } },
        { model: { $regex: options.search, $options: 'i' } },
        { vin: { $regex: options.search, $options: 'i' } },
        { category: { $regex: options.search, $options: 'i' } },
      ];
    }

    if (options.category) {
      filter.category = { $regex: `^${options.category}$`, $options: 'i' };
    }

    if (options.make) {
      filter.make = { $regex: `^${options.make}$`, $options: 'i' };
    }

    if (options.fuelType) {
      filter.fuelType = { $regex: `^${options.fuelType}$`, $options: 'i' };
    }

    if (options.transmission) {
      filter.transmission = { $regex: `^${options.transmission}$`, $options: 'i' };
    }

    if (options.status) {
      filter.status = options.status;
    }

    if (options.minPrice !== undefined || options.maxPrice !== undefined) {
      filter.price = {};
      if (options.minPrice !== undefined) {
        (filter.price as Record<string, number>).$gte = options.minPrice;
      }
      if (options.maxPrice !== undefined) {
        (filter.price as Record<string, number>).$lte = options.maxPrice;
      }
    }

    const sortField = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const [vehicles, total] = await Promise.all([
      this.model.find(filter).sort(sort as any).skip(skip).limit(limit).lean<IVehicle[]>().exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return {
      vehicles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    };
  }

  public async updateQuantity(id: string, quantityChange: number): Promise<IVehicle | null> {
    const vehicle = await this.model.findById(id).exec();
    if (!vehicle) return null;

    const newQuantity = vehicle.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    let status = VehicleStatus.AVAILABLE;
    if (newQuantity === 0) {
      status = VehicleStatus.OUT_OF_STOCK;
    } else if (newQuantity <= 3) {
      status = VehicleStatus.LOW_STOCK;
    }

    vehicle.quantity = newQuantity;
    vehicle.status = status;
    await vehicle.save();

    return vehicle.toObject() as IVehicle;
  }
}
