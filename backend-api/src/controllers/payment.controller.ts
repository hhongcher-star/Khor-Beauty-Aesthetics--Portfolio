import { Request, Response } from 'express';
import {
  getAllPayments,
  createPayment,
  updatePayment,
} from '../services/payment.service';

const allowedStatus = ['Pending', 'Paid', 'Failed', 'Refunded'];
const allowedMethods = [
  'Bank Transfer',
  'FPX',
  'Touch n Go eWallet',
  'Credit / Debit Card',
  'Cash',
];

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

export const addPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, bookingRef, customerName, amount, method, status } = req.body;

    if (!customerName || amount === undefined || !method) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    if (!allowedMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      });
    }

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    const payment = await createPayment({
      bookingId,
      bookingRef,
      customerName,
      amount,
      method,
      status: status || 'Pending',
    });

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

export const editPayment = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const { status, method, amount, bookingRef } = req.body;

    if (status && !allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status',
      });
    }

    if (method && !allowedMethods.includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      });
    }

    if (amount !== undefined && (typeof amount !== 'number' || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment amount',
      });
    }

    const updateData: any = {};

    if (status !== undefined) updateData.status = status;
    if (method !== undefined) updateData.method = method;
    if (amount !== undefined) updateData.amount = amount;
    if (bookingRef !== undefined) updateData.bookingRef = bookingRef;

    const updatedPayment = await updatePayment(id, updateData);

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