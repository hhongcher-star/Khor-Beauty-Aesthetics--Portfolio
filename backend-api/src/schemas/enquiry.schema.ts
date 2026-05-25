import { z } from 'zod';
import { emailSchema, phoneSchema } from './common.schema';

export const enquiryStatusSchema = z.enum(['New', 'Contacted', 'Closed', 'new', 'contacted', 'closed']);

export const createEnquirySchema = z.object({
  customerName: z.string().trim().min(2).max(100),
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().trim().min(5).max(1000),
  source: z.enum(['Website Form', 'WhatsApp', 'Instagram', 'Manual']).optional(),
});

export const updateEnquiryStatusSchema = z.object({
  status: enquiryStatusSchema,
});
