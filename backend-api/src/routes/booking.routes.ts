import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getBookings,
  addBooking,
  editBooking,
  removeBooking,
} from '../controllers/booking.controller';

const router = Router();

router.get('/', authMiddleware, getBookings);
router.post('/', addBooking);
router.put('/:id', authMiddleware, editBooking);
router.delete('/:id', authMiddleware, removeBooking);

export default router;