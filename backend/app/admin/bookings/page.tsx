'use client';

import { useEffect, useMemo, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Download, FileText, RefreshCw, Search } from 'lucide-react';

type Booking = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  service: string;
  status: string;
  paymentStatus?: string;
  appointment: string;
};

type StatusHistory = {
  status: string;
  at: string;
};

const statusOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
const paymentStatusOptions = ['All', 'Unpaid', 'Deposit Paid', 'Fully Paid', 'Refunded'];
const pageSizeOptions = [10, 25, 50];

const escapeCsv = (value: unknown) => `"${String(value ?? '').replaceAll('"', '""')}"`;

const downloadCsv = (filename: string, rows: Array<Record<string, unknown>>) => {
  if (rows.length === 0) return;

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.map(escapeCsv).join(','),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(',')),
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, StatusHistory[]>>({});

  useEffect(() => {
    fetchBookings();
    setNotes(JSON.parse(localStorage.getItem('bookingNotes') || '{}'));
    setHistory(JSON.parse(localStorage.getItem('bookingStatusHistory') || '{}'));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, paymentFilter, pageSize]);

  const fetchBookings = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiFetch('/bookings');
      setBookings(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to load bookings. Check the API connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredBookings = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return bookings.filter((booking) => {
      const matchesSearch =
        !query ||
        booking.customerName.toLowerCase().includes(query) ||
        booking.service.toLowerCase().includes(query) ||
        booking.email.toLowerCase().includes(query) ||
        booking.phone.toLowerCase().includes(query);

      const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || booking.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [bookings, paymentFilter, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const paginatedBookings = filteredBookings.slice((page - 1) * pageSize, page * pageSize);

  const saveNotes = (bookingId: string, note: string) => {
    const nextNotes = { ...notes, [bookingId]: note };
    setNotes(nextNotes);
    localStorage.setItem('bookingNotes', JSON.stringify(nextNotes));
  };

  const updateStatus = async (booking: Booking, status: string) => {
    try {
      await apiFetch(`/bookings/${booking.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      const nextHistory = {
        ...history,
        [booking.id]: [
          ...(history[booking.id] || []),
          { status, at: new Date().toISOString() },
        ],
      };

      setHistory(nextHistory);
      localStorage.setItem('bookingStatusHistory', JSON.stringify(nextHistory));
      await fetchBookings();
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to update booking status.');
    }
  };

  const exportFilteredBookings = () => {
    downloadCsv(
      'filtered-bookings.csv',
      filteredBookings.map((booking) => ({
        customerName: booking.customerName,
        email: booking.email,
        phone: booking.phone,
        service: booking.service,
        appointment: new Date(booking.appointment).toLocaleString(),
        status: booking.status,
        paymentStatus: booking.paymentStatus || 'Unpaid',
        adminNote: notes[booking.id] || '',
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, service, email, or phone..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-11 rounded-xl bg-card pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-[145px] rounded-xl bg-card">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="h-11 w-[155px] rounded-xl bg-card">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="h-11 rounded-xl" onClick={fetchBookings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="h-11 rounded-xl" onClick={exportFilteredBookings} disabled={filteredBookings.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Metric label="Total" value={bookings.length} />
        <Metric label="Pending" value={bookings.filter((booking) => booking.status === 'Pending').length} />
        <Metric label="Confirmed" value={bookings.filter((booking) => booking.status === 'Confirmed').length} />
        <Metric label="Filtered" value={filteredBookings.length} />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/30">
              <tr>
                {['Customer', 'Service', 'Date & Time', 'Status', 'Payment', 'Note', 'Actions'].map((header) => (
                  <th key={header} className="px-5 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-muted/20">
                  <td className="px-5 py-4 text-sm">
                    <p className="font-medium">{booking.customerName}</p>
                    <p className="text-xs text-muted-foreground">{booking.phone}</p>
                    <p className="text-xs text-muted-foreground">{booking.email}</p>
                  </td>
                  <td className="px-5 py-4 text-sm">{booking.service}</td>
                  <td className="px-5 py-4 text-sm">
                    <p>{new Date(booking.appointment).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(booking.appointment).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={booking.status} /></td>
                  <td className="px-5 py-4"><StatusBadge status={booking.paymentStatus || 'Unpaid'} /></td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">
                    {notes[booking.id] ? 'Has note' : 'No note'}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setSelectedBooking(booking)}>
                        View
                      </Button>
                      {['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
                        <Button
                          key={status}
                          variant="ghost"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => updateStatus(booking, status)}
                          disabled={booking.status === status}
                        >
                          {status}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredBookings.length === 0 && (
          <EmptyState title="No bookings found" description="Try changing the search term or filters." />
        )}

        {isLoading && (
          <EmptyState title="Loading bookings" description="Fetching latest booking records..." />
        )}

        <Pagination
          page={page}
          pageSize={pageSize}
          total={filteredBookings.length}
          totalPages={totalPages}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>

      <Dialog open={Boolean(selectedBooking)} onOpenChange={(open) => !open && setSelectedBooking(null)}>
        <DialogContent className="sm:max-w-[680px] rounded-2xl">
          {selectedBooking && (
            <>
              <DialogHeader>
                <DialogTitle>Booking Details</DialogTitle>
                <DialogDescription>Review customer details, admin notes, and local status history.</DialogDescription>
              </DialogHeader>

              <div className="grid gap-4">
                <div className="rounded-xl border p-4">
                  <p className="font-medium">{selectedBooking.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedBooking.phone}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bookingNote">Admin remarks</Label>
                  <textarea
                    id="bookingNote"
                    value={notes[selectedBooking.id] || ''}
                    onChange={(event) => saveNotes(selectedBooking.id, event.target.value)}
                    className="min-h-28 w-full rounded-xl border bg-background p-3 text-sm"
                    placeholder="Add internal remarks for follow-up, payment, or customer preferences..."
                  />
                </div>

                <div className="rounded-xl border p-4">
                  <p className="mb-3 text-sm font-medium">Status history</p>
                  {(history[selectedBooking.id] || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No local status changes recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {history[selectedBooking.id].map((entry, index) => (
                        <p key={`${entry.at}-${index}`} className="text-sm text-muted-foreground">
                          {entry.status} · {new Date(entry.at).toLocaleString()}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button className="rounded-xl" onClick={() => setSelectedBooking(null)}>Done</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-4">
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-12 text-center">
      <Calendar className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
      <p className="font-medium">{title}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function Pagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {total === 0 ? 0 : (page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}
      </p>
      <div className="flex items-center gap-2">
        <Select value={String(pageSize)} onValueChange={(value) => onPageSizeChange(Number(value))}>
          <SelectTrigger className="h-9 w-[90px] rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>{size}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">{page} / {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
