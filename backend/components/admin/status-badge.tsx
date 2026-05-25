'use client';

import { cn } from '@/lib/utils';

type StatusType = 
  | 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled'
  | 'Unpaid' | 'Deposit Paid' | 'Fully Paid' | 'Refunded'
  | 'New' | 'Contacted' | 'Closed'
  | 'Paid' | 'Failed'
  | 'Active' | 'Inactive';

interface StatusBadgeProps {
  status?: string;
  className?: string;
}

const statusStyles: Record<StatusType, string> = {
  // Booking status
  Pending: 'bg-amber-50 text-amber-700 border-amber-200',
  Confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Completed: 'bg-blue-50 text-blue-700 border-blue-200',
  Cancelled: 'bg-red-50 text-red-700 border-red-200',
  // Payment status
  Unpaid: 'bg-red-50 text-red-700 border-red-200',
  'Deposit Paid': 'bg-amber-50 text-amber-700 border-amber-200',
  'Fully Paid': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Refunded: 'bg-gray-50 text-gray-700 border-gray-200',
  // Enquiry status
  New: 'bg-pink-50 text-pink-700 border-pink-200',
  Contacted: 'bg-blue-50 text-blue-700 border-blue-200',
  Closed: 'bg-gray-50 text-gray-700 border-gray-200',
  // Payment record status
  Paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Failed: 'bg-red-50 text-red-700 border-red-200',
  // Service status
  Active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Inactive: 'bg-gray-50 text-gray-700 border-gray-200',
};

const statusAliases: Record<string, StatusType> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
  unpaid: 'Unpaid',
  'deposit paid': 'Deposit Paid',
  'fully paid': 'Fully Paid',
  refunded: 'Refunded',
  new: 'New',
  contacted: 'Contacted',
  closed: 'Closed',
  paid: 'Paid',
  failed: 'Failed',
  active: 'Active',
  inactive: 'Inactive',
};

const normalizeStatus = (status?: string): StatusType | null => {
  if (!status) return null;

  return statusAliases[status.trim().toLowerCase()] ?? null;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = normalizeStatus(status);

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        normalizedStatus
          ? statusStyles[normalizedStatus]
          : 'bg-gray-50 text-gray-700 border-gray-200',
        className
      )}
    >
      {normalizedStatus ?? status ?? 'Unknown'}
    </span>
  );
}
