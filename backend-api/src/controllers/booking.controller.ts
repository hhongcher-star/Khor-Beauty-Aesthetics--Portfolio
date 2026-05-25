import { Request, Response } from 'express';
import {
  getAllBookings,
  createBooking,
  updateBooking,
  deleteBooking,
} from '../services/booking.service';
import { CreateBookingInput, UpdateBookingInput } from '../schemas/booking.schema';

const badRequestMessages = [
  'Selected service is not available',
  'Appointment must be in the future',
  'Bookings are not available on Sundays',
  'Appointment must be within business hours',
  'This service already has a booking at the selected time',
  'Service is required',
];

const handleControllerError = (res: Response, error: unknown, fallback: string) => {
  const message = error instanceof Error ? error.message : fallback;
  const status = badRequestMessages.includes(message) ? 400 : message === 'Booking not found' ? 404 : 500;

  res.status(status).json({
    success: false,
    message: status === 500 ? fallback : message,
  });
};

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await getAllBookings();

    res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    handleControllerError(res, error, 'Failed to fetch bookings');
  }
};

export const addBooking = async (
  req: Request<Record<string, never>, unknown, CreateBookingInput>,
  res: Response
) => {
  try {
    const booking = await createBooking(req.body);

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(error);
    handleControllerError(res, error, 'Failed to create booking');
  }
};

export const editBooking = async (
  req: Request<{ id: string }, unknown, UpdateBookingInput>,
  res: Response
) => {
  try {
    const updatedBooking = await updateBooking(req.params.id, req.body);

    res.status(200).json({
      success: true,
      data: updatedBooking,
    });
  } catch (error) {
    console.error(error);
    handleControllerError(res, error, 'Failed to update booking');
  }
};

export const removeBooking = async (req: Request<{ id: string }>, res: Response) => {
  try {
    await deleteBooking(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Booking deleted successfully',
    });
  } catch (error) {
    console.error(error);
    handleControllerError(res, error, 'Failed to delete booking');
  }
};
