import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getBookings,
  addBooking,
  editBooking,
  removeBooking,
} from '../controllers/booking.controller';
import { validate } from '../middleware/validate.middleware';
import { idParamSchema } from '../schemas/common.schema';
import { createBookingSchema, updateBookingSchema } from '../schemas/booking.schema';

const router = Router();

router.get('/', authMiddleware, getBookings);
router.post('/', validate(createBookingSchema), addBooking);
router.put('/:id', authMiddleware, validate(idParamSchema, 'params'), validate(updateBookingSchema), editBooking);
router.delete('/:id', authMiddleware, validate(idParamSchema, 'params'), removeBooking);

export default router;
