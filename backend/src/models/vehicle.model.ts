import mongoose, { Schema } from 'mongoose';
import { IVehicleDocument } from '../interfaces/vehicle.interface.js';

const VehicleSchema = new Schema(
  {
    make: {
      type: String,
      required: [true, 'Make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Year is required'],
      min: [1900, 'Year must be valid'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      trim: true,
    },
    transmission: {
      type: String,
      required: [true, 'Transmission is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
      default: 1,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

export const VehicleModel = mongoose.model<IVehicleDocument>('Vehicle', VehicleSchema);
