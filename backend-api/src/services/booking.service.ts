import prisma from '../utils/prisma';

interface CreateBookingInput {
  customerName: string;
  email: string;
  phone: string;
  service: string;
  appointment: string;
}

export const getAllBookings = async () => {
  return await prisma.booking.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createBooking = async (data: CreateBookingInput) => {
  return await prisma.booking.create({
    data: {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      service: data.service,
      appointment: new Date(data.appointment),
    },
  });
};
export const updateBooking = async (id: string, data: any) => {
  return await prisma.booking.update({
    where: { id },
    data,
  });
};

export const deleteBooking = async (id: string) => {
  return await prisma.booking.delete({
    where: { id },
  });
};