import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getPayments,
  addPayment,
  editPayment,

} from '../controllers/payment.controller';

const router = Router();

router.get('/', authMiddleware, getPayments);
router.post('/', authMiddleware, addPayment);
router.put('/:id', authMiddleware, editPayment);
// router.delete('/:id', authMiddleware, removePayment);

export default router;