import { z } from 'zod';
import { VehicleStatus } from '../interfaces/vehicle.interface.js';

export const createVehicleSchema = z.object({
  body: z.object({
    make: z.string({ required_error: 'Make is required' }).trim().min(1, 'Make is required'),
    model: z.string({ required_error: 'Model is required' }).trim().min(1, 'Model is required'),
    year: z.number({ required_error: 'Year is required' }).int().min(1900).max(new Date().getFullYear() + 2),
    category: z.string({ required_error: 'Category is required' }).trim().min(1, 'Category is required'),
    fuelType: z.string({ required_error: 'Fuel type is required' }).trim().min(1, 'Fuel type is required'),
    transmission: z.string({ required_error: 'Transmission is required' }).trim().min(1, 'Transmission is required'),
    color: z.string({ required_error: 'Color is required' }).trim().min(1, 'Color is required'),
    vin: z.string({ required_error: 'VIN is required' }).trim().min(5, 'VIN must be at least 5 characters'),
    mileage: z.number({ required_error: 'Mileage is required' }).min(0, 'Mileage cannot be negative'),
    engineCapacity: z.string({ required_error: 'Engine capacity is required' }).trim().min(1, 'Engine capacity is required'),
    price: z.number({ required_error: 'Price is required' }).positive('Price must be positive'),
    quantity: z.number({ required_error: 'Quantity is required' }).int().min(0, 'Quantity cannot be negative').default(1),
    image: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
    status: z.nativeEnum(VehicleStatus).optional(),
  }),
});

export const updateVehicleSchema = z.object({
  body: createVehicleSchema.shape.body.partial(),
});

export const restockVehicleSchema = z.object({
  body: z.object({
    quantity: z.number({ required_error: 'Quantity to restock is required' }).int().positive('Quantity must be positive'),
  }),
});

export const queryVehicleSchema = z.object({
  query: z.object({
    page: z.string().optional().default('1').transform((val) => parseInt(val, 10)),
    limit: z.string().optional().default('10').transform((val) => parseInt(val, 10)),
    search: z.string().optional(),
    category: z.string().optional(),
    make: z.string().optional(),
    fuelType: z.string().optional(),
    transmission: z.string().optional(),
    minPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    maxPrice: z.string().optional().transform((val) => (val ? parseFloat(val) : undefined)),
    status: z.string().optional(),
    sortBy: z.string().optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
  }),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
