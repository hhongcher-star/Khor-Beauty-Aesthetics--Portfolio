import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const emailSchema = z.string().trim().email().max(254);

export const phoneSchema = z
  .string()
  .trim()
  .min(7)
  .max(30)
  .regex(/^[+\d\s().-]+$/, 'Phone number contains invalid characters');

export const positiveMoneySchema = z.coerce
  .number()
  .positive()
  .max(100000);
