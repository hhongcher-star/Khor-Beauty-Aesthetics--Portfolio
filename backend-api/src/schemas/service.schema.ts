import { z } from 'zod';
import { positiveMoneySchema } from './common.schema';

export const serviceCategorySchema = z.enum([
  'Skin Booster',
  'Facial Treatment',
  'Anti-Aging',
  'Brightening',
  'Hydration',
  'Body Treatment',
  'Other',
]);

export const createServiceSchema = z.object({
  name: z.string().trim().min(2).max(100),
  description: z.string().trim().min(5).max(500),
  price: positiveMoneySchema,
  durationMin: z.coerce.number().int().min(15).max(480).default(60),
  category: serviceCategorySchema,
  active: z.boolean().optional().default(true),
});

export const updateServiceSchema = createServiceSchema.partial().strict();
