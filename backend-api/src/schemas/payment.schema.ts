import { z } from 'zod';
import { positiveMoneySchema } from './common.schema';

export const paymentStatusSchema = z.enum(['Pending', 'Paid', 'Failed', 'Refunded']);

export const paymentMethodSchema = z.enum([
  'Bank Transfer',
  'FPX',
  'Touch n Go eWallet',
  'Credit / Debit Card',
  'Cash',
]);

export const createPaymentSchema = z.object({
  bookingId: z.string().trim().min(1).optional(),
  bookingRef: z.string().trim().max(100).optional(),
  customerName: z.string().trim().min(2).max(100),
  amount: positiveMoneySchema,
  method: paymentMethodSchema,
  status: paymentStatusSchema.optional().default('Pending'),
});

export const updatePaymentSchema = z
  .object({
    bookingRef: z.string().trim().max(100).optional(),
    amount: positiveMoneySchema.optional(),
    method: paymentMethodSchema.optional(),
    status: paymentStatusSchema.optional(),
  })
  .strict();

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;
export type UpdatePaymentInput = z.infer<typeof updatePaymentSchema>;
