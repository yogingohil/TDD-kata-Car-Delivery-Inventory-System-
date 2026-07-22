import { Document, Types } from 'mongoose';

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

export interface IVehicle {
  _id?: Types.ObjectId;
  make: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  transmission: string;
  color: string;
  vin: string;
  mileage: number;
  engineCapacity: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  status?: VehicleStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IVehicleDocument = IVehicle & Document;
