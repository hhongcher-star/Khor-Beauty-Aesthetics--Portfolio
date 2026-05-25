import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  getPayments,
  addPayment,
  editPayment,

} from '../controllers/payment.controller';
import { validate } from '../middleware/validate.middleware';
import { idParamSchema } from '../schemas/common.schema';
import { createPaymentSchema, updatePaymentSchema } from '../schemas/payment.schema';

const router = Router();

router.get('/', authMiddleware, getPayments);
router.post('/', authMiddleware, validate(createPaymentSchema), addPayment);
router.put('/:id', authMiddleware, validate(idParamSchema, 'params'), validate(updatePaymentSchema), editPayment);
// router.delete('/:id', authMiddleware, removePayment);

export default router;
