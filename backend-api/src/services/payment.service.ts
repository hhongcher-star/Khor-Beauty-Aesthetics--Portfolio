import prisma from '../utils/prisma';

export const getAllPayments = async () => {
  return prisma.payment.findMany({
    orderBy: { createdAt: 'desc' },
  });
};

export const createPayment = async (data: any) => {
  return prisma.payment.create({
    data,
  });
};

export const updatePayment = async (id: string, data: any) => {
  return prisma.payment.update({
    where: { id },
    data,
  });
};

export const deletePayment = async (id: string) => {
  return prisma.payment.delete({
    where: { id },
  });
};