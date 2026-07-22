import { z } from 'zod';

export const createPurchaseSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Vehicle ID parameter is required'),
  }),
  body: z.object({
    quantity: z.number().int().min(1, 'Quantity must be at least 1').optional().default(1),
  }),
});

export type CreatePurchaseInput = z.infer<typeof createPurchaseSchema>;
