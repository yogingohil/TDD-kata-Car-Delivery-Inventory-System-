import { z } from 'zod';

export const createVehicleSchema = z.object({
  body: z.object({
    make: z.string().min(1, 'Make is required'),
    model: z.string().min(1, 'Model is required'),
    year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
    category: z.string().min(1, 'Category is required'),
    fuelType: z.string().min(1, 'Fuel type is required'),
    transmission: z.string().min(1, 'Transmission is required'),
    price: z.number().positive('Price must be positive'),
    quantity: z.number().int().min(0, 'Quantity cannot be negative').default(1),
    image: z.string().url().optional().or(z.literal('')),
    description: z.string().optional(),
  }),
});

export const updateVehicleSchema = z.object({
  body: createVehicleSchema.shape.body.partial(),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
