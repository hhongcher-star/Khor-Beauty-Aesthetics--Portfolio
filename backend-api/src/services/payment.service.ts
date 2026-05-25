import prisma from '../utils/prisma';
import { CreatePaymentInput, UpdatePaymentInput } from '../schemas/payment.schema';

const methodMap: Record<string, string> = {
  'Bank Transfer': 'BankTransfer',
  FPX: 'FPX',
  'Touch n Go eWallet': 'TouchNGoEWallet',
  'Credit / Debit Card': 'CreditDebitCard',
  Cash: 'Cash',
};

const displayMethodMap: Record<string, string> = {
  BankTransfer: 'Bank Transfer',
  TouchNGoEWallet: 'Touch n Go eWallet',
  CreditDebitCard: 'Credit / Debit Card',
};

const serializePayment = (payment: any) => ({
  ...payment,
  amount: Number(payment.amount),
  method: displayMethodMap[payment.method] ?? payment.method,
});

export const getAllPayments = async () => {
  const payments = await prisma.payment.findMany({
    include: { booking: true },
    orderBy: { createdAt: 'desc' },
  });

  return payments.map(serializePayment);
};

export const createPayment = async (data: CreatePaymentInput) => {
  const payment = await prisma.payment.create({
    data: {
      ...data,
      method: methodMap[data.method],
    } as never,
    include: { booking: true },
  });

  return serializePayment(payment);
};

export const updatePayment = async (id: string, data: UpdatePaymentInput) => {
  const payment = await prisma.payment.update({
    where: { id },
    data: {
      ...data,
      ...(data.method ? { method: methodMap[data.method] } : {}),
    } as never,
    include: { booking: true },
  });

  return serializePayment(payment);
};

export const deletePayment = async (id: string) => {
  return prisma.payment.delete({
    where: { id },
  });
};
