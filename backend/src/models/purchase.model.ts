import mongoose, { Schema } from 'mongoose';
import { IPurchaseDocument } from '../interfaces/purchase.interface.js';

const PurchaseSchema = new Schema({
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle ID is required'],
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price is required'],
    min: [0, 'Total price must be non-negative'],
  },
  purchasedAt: {
    type: Date,
    default: Date.now,
  },
});

export const PurchaseModel = mongoose.model<IPurchaseDocument>('Purchase', PurchaseSchema);
