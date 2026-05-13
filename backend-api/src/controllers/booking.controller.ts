import { Request, Response } from 'express';
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../services/booking.service';

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await getAllBookings();

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
    });
  }
};

export const addBooking = async (req: Request, res: Response) => {
  try {
    const booking = await createBooking(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
    });
  }
};
export const editBooking = async (req: Request, res: Response) => {
  try {
     const id = req.params.id as string;

    const updatedBooking = await updateBooking(id, req.body);

    res.status(200).json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
    });
  }
};

export const removeBooking = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    await deleteBooking(id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking',
    });
  }
};