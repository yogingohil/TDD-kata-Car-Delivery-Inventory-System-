import { IUser } from './user.interface.js';
import { IVehicle } from './vehicle.interface.js';
import { IPurchase } from './purchase.interface.js';

export interface IAuthService {
  register(userData: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }>;
  login(email: string, password: string): Promise<{ user: Partial<IUser>; token: string }>;
}

export interface IVehicleService {
  createVehicle(data: Partial<IVehicle>): Promise<IVehicle>;
  getVehicleById(id: string): Promise<IVehicle | null>;
  getAllVehicles(): Promise<IVehicle[]>;
  updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle | null>;
  deleteVehicle(id: string): Promise<boolean>;
}

export interface IPurchaseService {
  processPurchase(userId: string, vehicleId: string, quantity: number): Promise<IPurchase>;
  getUserPurchases(userId: string): Promise<IPurchase[]>;
}
