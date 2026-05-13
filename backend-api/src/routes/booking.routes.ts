import { Router } from 'express';
import {
  getBookings,
  addBooking,
  editBooking,
  removeBooking,
} from '../controllers/booking.controller';

const router = Router();

router.get('/', getBookings);
router.post('/', addBooking);
router.put('/:id', editBooking);
router.delete('/:id', removeBooking);

export default router;