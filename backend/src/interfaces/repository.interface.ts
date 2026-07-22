import { IUser } from './user.interface.js';
import { IVehicle } from './vehicle.interface.js';
import { IPurchase } from './purchase.interface.js';

export interface IBaseRepository<T> {
  create(item: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findAll(filter?: Record<string, unknown>): Promise<T[]>;
  update(id: string, item: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}

export interface IVehicleRepository extends IBaseRepository<IVehicle> {
  findByVin(vin: string): Promise<IVehicle | null>;
  findWithFilters(options: Record<string, unknown>): Promise<{
    vehicles: IVehicle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  updateQuantity(id: string, quantityChange: number): Promise<IVehicle | null>;
}

export interface IPurchaseRepository extends IBaseRepository<IPurchase> {
  findByUserId(userId: string): Promise<IPurchase[]>;
  findAllWithPopulate(): Promise<IPurchase[]>;
}
