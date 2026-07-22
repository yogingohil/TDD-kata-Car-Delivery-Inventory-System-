import { IUser } from './user.interface.js';
import { IVehicle } from './vehicle.interface.js';
import { IPurchase } from './purchase.interface.js';

export interface AuthResultPayload {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: Date;
  };
  accessToken: string;
  expiresIn: string;
}

export interface IAuthService {
  register(userData: Partial<IUser>): Promise<AuthResultPayload>;
  login(email: string, password: string): Promise<AuthResultPayload>;
}

export interface IVehicleService {
  createVehicle(data: Partial<IVehicle>): Promise<IVehicle>;
  getVehicleById(id: string): Promise<IVehicle>;
  getAllVehicles(options?: Record<string, unknown>): Promise<{
    vehicles: IVehicle[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>;
  updateVehicle(id: string, data: Partial<IVehicle>): Promise<IVehicle>;
  deleteVehicle(id: string): Promise<boolean>;
  restockVehicle(id: string, restockQuantity: number): Promise<IVehicle>;
}

export interface IPurchaseService {
  processPurchase(userId: string, vehicleId: string, quantity: number): Promise<IPurchase>;
  getUserPurchases(userId: string): Promise<IPurchase[]>;
  getAllPurchases(): Promise<IPurchase[]>;
}
