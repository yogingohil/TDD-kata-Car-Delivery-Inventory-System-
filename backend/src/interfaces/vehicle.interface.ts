import { Document, Types } from 'mongoose';

export interface IVehicle {
  _id?: Types.ObjectId;
  make: string;
  model: string;
  year: number;
  category: string;
  fuelType: string;
  transmission: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export type IVehicleDocument = IVehicle & Document;
