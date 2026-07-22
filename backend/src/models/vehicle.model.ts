import mongoose, { Schema } from 'mongoose';
import { IVehicleDocument, VehicleStatus } from '../interfaces/vehicle.interface.js';

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
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true,
    },
    vin: {
      type: String,
      required: [true, 'VIN is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    mileage: {
      type: Number,
      required: [true, 'Mileage is required'],
      min: [0, 'Mileage cannot be negative'],
      default: 0,
    },
    engineCapacity: {
      type: String,
      required: [true, 'Engine capacity is required'],
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
      default: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: Object.values(VehicleStatus),
      default: VehicleStatus.AVAILABLE,
    },
  },
  {
    timestamps: true,
  },
);

VehicleSchema.index({ make: 1, model: 1 });
VehicleSchema.index({ category: 1 });
VehicleSchema.index({ status: 1 });

export const VehicleModel = mongoose.model<IVehicleDocument>('Vehicle', VehicleSchema);
