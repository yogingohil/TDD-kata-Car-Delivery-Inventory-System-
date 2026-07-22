import { z } from 'zod';

export const createPurchaseSchema = z.object({
  body: z.object({
    vehicleId: z.string().min(1, 'Vehicle ID is required'),
    quantity: z.number().int().min(1, 'Quantity must be at least 1'),
  }),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
