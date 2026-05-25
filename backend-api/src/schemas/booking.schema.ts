import { z } from 'zod';
import { emailSchema, phoneSchema } from './common.schema';

export const bookingStatusSchema = z.enum([
  'Pending',
  'Confirmed',
  'Completed',
  'Cancelled',
]);

export const bookingPaymentStatusSchema = z.enum([
  'Unpaid',
  'DepositPaid',
  'FullyPaid',
  'Refunded',
  'Deposit Paid',
  'Fully Paid',
]);

export const createBookingSchema = z
  .object({
    customerName: z.string().trim().min(2).max(100),
    email: emailSchema,
    phone: phoneSchema,
    serviceId: z.string().trim().min(1).optional(),
    service: z.string().trim().min(1).max(120).optional(),
    appointment: z.string().datetime({ offset: true }),
  })
  .refine((data) => data.serviceId || data.service, {
    message: 'Either serviceId or service is required',
    path: ['serviceId'],
  });

export const updateBookingSchema = z
  .object({
    customerName: z.string().trim().min(2).max(100).optional(),
    email: emailSchema.optional(),
    phone: phoneSchema.optional(),
    serviceId: z.string().trim().min(1).optional(),
    service: z.string().trim().min(1).max(120).optional(),
    appointment: z.string().datetime({ offset: true }).optional(),
    status: bookingStatusSchema.optional(),
    paymentStatus: bookingPaymentStatusSchema.optional(),
  })
  .strict();

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
