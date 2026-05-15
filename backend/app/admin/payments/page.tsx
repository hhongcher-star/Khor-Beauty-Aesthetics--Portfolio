'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { StatCard } from '@/components/admin/stat-card';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  MoreHorizontal,
  Eye,
  RefreshCw,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
  
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
type Payment = {
  id: string;
  bookingId?: string;
  bookingRef?: string;
  customerName: string;
  amount: number;
  method: string;
  status: string;
  date: string;
};

const statusOptions = ['All', 'Pending', 'Paid', 'Failed', 'Refunded'];
const methodOptions = ['All', 'Bank Transfer', 'FPX', 'Touch n Go eWallet', 'Credit / Debit Card', 'Cash'];

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [methodFilter, setMethodFilter] = useState('All');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  useEffect(() => {
  fetchPayments();
}, []);

const fetchPayments = async () => {
  try {
    const response = await apiFetch('/payments');

    if (Array.isArray(response)) {
      setPayments(response);
    } else {
      setPayments(response.data || []);
    }
  } catch (error) {
    console.error(error);
  }
};
const handleViewPayment = (payment: Payment) => {
  setSelectedPayment(payment);
  setIsViewDialogOpen(true);
};

const handleUpdateStatus = async (id: string, status: string) => {
  try {
    await apiFetch(`/payments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
      }),
    });

    fetchPayments();
  } catch (error) {
    console.error(error);
  }
};

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.bookingRef?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'All' || payment.method === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Calculate summary stats
  const totalPaid =payments
    .filter((p) => p.status === 'Paid')
    .reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments =payments
    .filter((p) => p.status === 'Pending')
    .reduce((sum, p) => sum + p.amount, 0);
  const refundedAmount =payments
    .filter((p) => p.status === 'Refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Paid"
          value={`RM ${totalPaid.toLocaleString()}`}
          icon={CheckCircle}
        />
        <StatCard
          title="Pending Payments"
          value={`RM ${pendingPayments.toLocaleString()}`}
          icon={Clock}
        />
        <StatCard
          title="Deposit Collected"
          value="RM 1,250"
          icon={DollarSign}
        />
        <StatCard
          title="Refunded Amount"
          value={`RM ${refundedAmount.toLocaleString()}`}
          icon={XCircle}
        />
      </div>

      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer, ID, or booking ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] h-11 rounded-xl bg-card border-border/50">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-[180px] h-11 rounded-xl bg-card border-border/50">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              {methodOptions.map((method) => (
                <SelectItem key={method} value={method}>
                  {method}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Payment ID
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Booking Ref
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Amount
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Method
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Date
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredPayments.map((payment) => (
                <PaymentRow
  key={payment.id}
  payment={payment}
  onView={handleViewPayment}
  onUpdateStatus={handleUpdateStatus}
/>
              ))}
            </tbody>
          </table>
        </div>
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No payments found</p>
            <p className="text-sm text-muted-foreground/70">Try adjusting your search or filters</p>
          </div>
        )}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
  <DialogContent className="sm:max-w-[650px] rounded-2xl">
    <DialogHeader>
      <DialogTitle className="font-serif text-2xl">
        Payment Details
      </DialogTitle>

      <DialogDescription>
        Review the customer payment information.
      </DialogDescription>
    </DialogHeader>

    {selectedPayment && (
      <div className="space-y-6 py-2">
        <div className="rounded-2xl border border-border/50 bg-muted/20 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Customer
              </p>

              <h3 className="text-xl font-semibold text-foreground">
                {selectedPayment.customerName}
              </h3>

              <p className="text-sm text-muted-foreground">
                Payment ID: {selectedPayment.id}
              </p>

              <p className="text-sm text-muted-foreground">
                Booking Ref: {selectedPayment.bookingRef || '-'}
              </p>
            </div>

            <StatusBadge status={selectedPayment.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Amount
            </p>

            <p className="font-medium">
              RM {selectedPayment.amount}
            </p>
          </div>

          <div className="rounded-xl border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Method
            </p>

            <p className="font-medium">
              {selectedPayment.method}
            </p>
          </div>

          <div className="rounded-xl border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Payment Date
            </p>

            <p className="font-medium">
              {new Date(selectedPayment.date).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-xl border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">
              Status
            </p>

            <StatusBadge status={selectedPayment.status} />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsViewDialogOpen(false)}
            className="rounded-xl"
          >
            Close
          </Button>
        </DialogFooter>
      </div>
    )}
  </DialogContent>
</Dialog>
      </div>
    </div>
  );
}

function PaymentRow({
  payment,
  onView,
  onUpdateStatus,
}: {
  payment: Payment;
  onView: (payment: Payment) => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-5 py-4">
        <p className="font-mono text-sm text-foreground">{payment.id}</p>
      </td>
      <td className="px-5 py-4">
        <p className="font-medium text-foreground text-sm">{payment.customerName}</p>
      </td>
      <td className="px-5 py-4">
        <p className="font-mono text-sm text-muted-foreground">{payment.bookingRef}</p>
      </td>
      <td className="px-5 py-4">
        <p className="font-semibold text-foreground">RM {payment.amount}</p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-foreground">{payment.method}</p>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={payment.status} />
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-muted-foreground">{new Date(payment.date).toLocaleDateString()}</p>
      </td>
      <td className="px-5 py-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl">
           <DropdownMenuItem
  onClick={() => onView(payment)}
  className="cursor-pointer"
>
  <Eye className="h-4 w-4 mr-2" />
  View Details
</DropdownMenuItem>

{['Pending', 'Paid', 'Failed', 'Refunded'].map((status) => (
  <DropdownMenuItem
    key={status}
    onClick={() => onUpdateStatus(payment.id, status)}
    className="cursor-pointer"
  >
    <RefreshCw className="h-4 w-4 mr-2" />
    Mark as {status}
  </DropdownMenuItem>
))}
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
