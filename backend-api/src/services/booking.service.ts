import prisma from '../utils/prisma';
import { CreateBookingInput, UpdateBookingInput } from '../schemas/booking.schema';

const BUSINESS_START_HOUR = 9;
const BUSINESS_END_HOUR = 18;

const bookingPaymentStatusMap: Record<string, string> = {
  'Deposit Paid': 'DepositPaid',
  'Fully Paid': 'FullyPaid',
};

const displayPaymentStatusMap: Record<string, string> = {
  DepositPaid: 'Deposit Paid',
  FullyPaid: 'Fully Paid',
};

const serializeBooking = (booking: any) => ({
  ...booking,
  service: booking.serviceName,
  paymentStatus: displayPaymentStatusMap[booking.paymentStatus] ?? booking.paymentStatus,
});

const normalizePaymentStatus = (status?: string) => {
  if (!status) return undefined;
  return bookingPaymentStatusMap[status] ?? status;
};

const resolveService = async (serviceId?: string, serviceName?: string) => {
  if (serviceId) {
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service || !service.active) {
      throw new Error('Selected service is not available');
    }

    return service;
  }

  if (!serviceName) {
    throw new Error('Service is required');
  }

  const service = await prisma.service.findFirst({
    where: {
      name: {
        equals: serviceName,
        mode: 'insensitive',
      },
      active: true,
    },
  });

  if (!service) {
    throw new Error('Selected service is not available');
  }

  return service;
};

const assertBookableAppointment = async (
  appointment: Date,
  serviceId: string,
  durationMin: number,
  ignoreBookingId?: string
) => {
  const now = new Date();

  if (appointment <= now) {
    throw new Error('Appointment must be in the future');
  }

  const day = appointment.getDay();
  if (day === 0) {
    throw new Error('Bookings are not available on Sundays');
  }

  const end = new Date(appointment.getTime() + durationMin * 60 * 1000);
  const open = new Date(appointment);
  open.setHours(BUSINESS_START_HOUR, 0, 0, 0);
  const close = new Date(appointment);
  close.setHours(BUSINESS_END_HOUR, 0, 0, 0);

  if (appointment < open || end > close) {
    throw new Error('Appointment must be within business hours');
  }

  const duplicate = await prisma.booking.findFirst({
    where: {
      appointment,
      serviceId,
      ...(ignoreBookingId ? { id: { not: ignoreBookingId } } : {}),
    },
  });

  if (duplicate) {
    throw new Error('This service already has a booking at the selected time');
  }
};

export const getAllBookings = async () => {
  const bookings = await prisma.booking.findMany({
    include: { service: true },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return bookings.map(serializeBooking);
};

export const createBooking = async (data: CreateBookingInput) => {
  const service = await resolveService(data.serviceId, data.service);
  const appointment = new Date(data.appointment);

  await assertBookableAppointment(appointment, service.id, service.durationMin);

  const booking = await prisma.booking.create({
    data: {
      customerName: data.customerName,
      email: data.email,
      phone: data.phone,
      serviceId: service.id,
      serviceName: service.name,
      appointment,
    } as never,
    include: { service: true },
  });

  return serializeBooking(booking);
};

export const updateBooking = async (id: string, data: UpdateBookingInput) => {
  const existing = await prisma.booking.findUnique({
    where: { id },
    include: { service: true },
  });

  if (!existing) {
    throw new Error('Booking not found');
  }

  const service =
    data.serviceId || data.service
      ? await resolveService(data.serviceId, data.service)
      : existing.service;

  if (!service && !existing.serviceId) {
    throw new Error('Selected service is not available');
  }

  const appointment = data.appointment ? new Date(data.appointment) : existing.appointment;
  const serviceId = service?.id ?? existing.serviceId;
  const durationMin = service?.durationMin ?? 60;

  if (serviceId && (data.appointment || data.serviceId || data.service)) {
    await assertBookableAppointment(appointment, serviceId, durationMin, id);
  }

  const booking = await prisma.booking.update({
    where: { id },
    data: {
      ...(data.customerName !== undefined ? { customerName: data.customerName } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(service ? { serviceId: service.id, serviceName: service.name } : {}),
      ...(data.appointment !== undefined ? { appointment } : {}),
      ...(data.status !== undefined ? { status: data.status } : {}),
      ...(data.paymentStatus !== undefined
        ? { paymentStatus: normalizePaymentStatus(data.paymentStatus) }
        : {}),
    } as never,
    include: { service: true },
  });

  return serializeBooking(booking);
};

export const deleteBooking = async (id: string) => {
  return await prisma.booking.delete({
    where: { id },
  });
};
