import { Request, Response } from 'express';
import {
  getAllPayments,
  createPayment,
  updatePayment,
} from '../services/payment.service';
import { CreatePaymentInput, UpdatePaymentInput } from '../schemas/payment.schema';

export const getPayments = async (req: Request, res: Response) => {
  try {
    const payments = await getAllPayments();

    res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
    });
  }
};

export const addPayment = async (
  req: Request<Record<string, never>, unknown, CreatePaymentInput>,
  res: Response
) => {
  try {
    const payment = await createPayment(req.body);

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create payment',
    });
  }
};

export const editPayment = async (
  req: Request<{ id: string }, unknown, UpdatePaymentInput>,
  res: Response
) => {
  try {
    const updatedPayment = await updatePayment(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: updatedPayment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update payment',
    });
  }
};
