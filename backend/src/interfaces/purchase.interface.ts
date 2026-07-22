import { Document, Types } from 'mongoose';

export interface IPurchase {
  _id?: Types.ObjectId;
  vehicleId: Types.ObjectId;
  userId: Types.ObjectId;
  quantity: number;
  totalPrice: number;
  purchasedAt: Date;
}

export type IPurchaseDocument = IPurchase & Document;
