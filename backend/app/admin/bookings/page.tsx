'use client';

import { useEffect, useState } from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
DropdownMenuSubContent,
DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Calendar,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
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
const statusOptions = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
const paymentStatusOptions = ['All', 'Unpaid', 'Deposit Paid', 'Fully Paid', 'Refunded'];

export default function BookingsPage() {

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  useEffect(() => {
    
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await apiFetch('/bookings');

if (Array.isArray(response)) {
  setBookings(response);
} else {
  setBookings(response.data || []);
}
    } catch (error) {
      console.error(error);

    }
  };
  const handleViewBooking = (booking: Booking) => {
  setSelectedBooking(booking);
  setIsViewDialogOpen(true);
};
const [addForm, setAddForm] = useState({
  customerName: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  time: '',
});
const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

const [editForm, setEditForm] = useState({
  id: '',
  customerName: '',
  email: '',
  phone: '',
  service: '',
  date: '',
  time: '',
  status: 'Pending',
  paymentStatus: 'Unpaid',
});
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || booking.status === statusFilter;
    const matchesPayment = paymentFilter === 'All' || booking.paymentStatus === paymentFilter;
    return matchesSearch && matchesStatus && matchesPayment;
  });
  const handleDeleteBooking = async (id: string) => {
  try {
    await apiFetch(`/bookings/${id}`, {
      method: 'DELETE',
    });

    fetchBookings();
  } catch (error) {
    console.error(error);
    
  }
};
const handleCreateBooking = async () => {
  try {
    await apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        customerName: addForm.customerName,
        email: addForm.email,
        phone: addForm.phone,
        service: addForm.service,
        appointment: new Date(`${addForm.date}T${addForm.time}`).toISOString(),
        status: 'Pending',
        paymentStatus: 'Unpaid',
      }),
    });

    setIsAddDialogOpen(false);
    setAddForm({
      customerName: '',
      email: '',
      phone: '',
      service: '',
      date: '',
      time: '',
    });

    fetchBookings();
  } catch (error) {
    console.error(error);
  }
};
const handleUpdateStatus = async (id: string, status: string) => {
  try {
    await apiFetch(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
      }),
    });

    fetchBookings();
  } catch (error) {
    console.error(error);
  }
};
const handleOpenEdit = (booking: Booking) => {
  const appointment = new Date(booking.appointment);

  setEditForm({
    id: booking.id,
    customerName: booking.customerName,
    email: booking.email,
    phone: booking.phone,
    service: booking.service,
    date: appointment.toISOString().split('T')[0],
    time: appointment.toTimeString().slice(0, 5),
    status: booking.status,
    paymentStatus: booking.paymentStatus || 'Unpaid',
  });

  setIsEditDialogOpen(true);
};
const handleEditBooking = async () => {
  try {
    await apiFetch(`/bookings/${editForm.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        customerName: editForm.customerName,
        email: editForm.email,
        phone: editForm.phone,
        service: editForm.service,
        appointment: new Date(`${editForm.date}T${editForm.time}`).toISOString(),
        status: editForm.status,
        paymentStatus: editForm.paymentStatus,
      }),
    });

    setIsEditDialogOpen(false);
    fetchBookings();
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, service, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px] h-11 rounded-xl bg-card border-border/50">
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
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-[150px] h-11 rounded-xl bg-card border-border/50">
              <SelectValue placeholder="Payment" />
            </SelectTrigger>
            <SelectContent>
              {paymentStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                Add Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-2xl">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">New Booking</DialogTitle>
                <DialogDescription>
                  Add a new customer booking. Fill in all the required details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Customer Name</Label>
                    <Input id="name" placeholder="Full name"  value={addForm.customerName} onChange={(e) => setAddForm({ ...addForm, customerName: e.target.value })} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" placeholder="012-345 6789"value={addForm.phone} onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })} className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com"   value={addForm.email} onChange={(e) => setAddForm({ ...addForm, email: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="service">Service</Label>
                  <Select  value={addForm.service} onValueChange={(value) =>setAddForm({ ...addForm, service: value })}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skin-booster">Skin Booster Treatment</SelectItem>
                      <SelectItem value="korean-glow">Korean Glow Facial</SelectItem>
                      <SelectItem value="brightening">Brightening Treatment</SelectItem>
                      <SelectItem value="anti-aging">Anti-Aging Rejuvenation</SelectItem>
                      <SelectItem value="hydration">Hydration Facial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input id="date" type="date"value={addForm.date} onChange={(e) => setAddForm({ ...addForm, date: e.target.value })} className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input id="time" type="time" value={addForm.time} onChange={(e) => setAddForm({ ...addForm, time: e.target.value })}  className="rounded-xl" />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleCreateBooking} className="rounded-xl bg-primary hover:bg-primary/90">
                  Create Booking
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-foreground">{bookings.length}</p>
          <p className="text-xs text-muted-foreground">Total Bookings</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-amber-600">
            {bookings.filter((b) => b.status === 'Pending').length}
          </p>
          <p className="text-xs text-muted-foreground">Pending</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-emerald-600">
            {bookings.filter((b) => b.status === 'Confirmed').length}
          </p>
          <p className="text-xs text-muted-foreground">Confirmed</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-blue-600">
            {bookings.filter((b) => b.status === 'Completed').length}
          </p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/30 border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Customer
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Service
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Date & Time
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Payment
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredBookings.map((booking) => (
              <BookingRow
  key={booking.id}
  booking={booking}
  onDelete={handleDeleteBooking}
  onView={handleViewBooking}
  onUpdateStatus={handleUpdateStatus}
  onEdit={handleOpenEdit}
/>
              ))}
            </tbody>
          </table>
        </div>
        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <p className="text-muted-foreground">No bookings found</p>
            <p className="text-sm text-muted-foreground/70">Try adjusting your search or filters</p>
          </div>
        )}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
  <DialogContent className="sm:max-w-[650px] rounded-2xl">
    <DialogHeader>
      <DialogTitle className="font-serif text-2xl">
        Booking Details
      </DialogTitle>
      <DialogDescription>
        Review the customer appointment and payment information.
      </DialogDescription>
    </DialogHeader>

    {selectedBooking && (
      <div className="space-y-6 py-2">
        <div className="rounded-2xl border border-border/50 bg-muted/20 p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">
                Customer
              </p>
              <h3 className="text-xl font-semibold text-foreground">
                {selectedBooking.customerName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {selectedBooking.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedBooking.phone}
              </p>
            </div>

            <StatusBadge status={selectedBooking.status} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Service</p>
            <p className="font-medium">{selectedBooking.service}</p>
          </div>

          <div className="rounded-xl border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Payment Status</p>
            <StatusBadge status={selectedBooking.paymentStatus || 'Unpaid'} />
          </div>

          <div className="rounded-xl border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Appointment Date</p>
            <p className="font-medium">
              {new Date(selectedBooking.appointment).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-xl border border-border/50 p-4">
            <p className="text-xs text-muted-foreground mb-1">Appointment Time</p>
            <p className="font-medium">
              {new Date(selectedBooking.appointment).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setIsViewDialogOpen(false)}
            className="rounded-xl"
          >
            Close
          </Button>

          <Button className="rounded-xl">
            Edit Booking
          </Button>
        </DialogFooter>
      </div>
    )}
  </DialogContent>
</Dialog>
<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
  <DialogContent className="sm:max-w-[500px] rounded-2xl">
    <DialogHeader>
      <DialogTitle className="font-serif text-xl">Edit Booking</DialogTitle>
      <DialogDescription>
        Update the customer booking details.
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Customer Name</Label>
          <Input
            value={editForm.customerName}
            onChange={(e) =>
              setEditForm({ ...editForm, customerName: e.target.value })
            }
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Phone Number</Label>
          <Input
            value={editForm.phone}
            onChange={(e) =>
              setEditForm({ ...editForm, phone: e.target.value })
            }
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="email"
          value={editForm.email}
          onChange={(e) =>
            setEditForm({ ...editForm, email: e.target.value })
          }
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label>Service</Label>
        <Select
          value={editForm.service}
          onValueChange={(value) =>
            setEditForm({ ...editForm, service: value })
          }
        >
          <SelectTrigger className="rounded-xl">
            <SelectValue placeholder="Select a service" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="skin-booster">Skin Booster Treatment</SelectItem>
            <SelectItem value="korean-glow">Korean Glow Facial</SelectItem>
            <SelectItem value="brightening">Brightening Treatment</SelectItem>
            <SelectItem value="anti-aging">Anti-Aging Rejuvenation</SelectItem>
            <SelectItem value="hydration">Hydration Facial</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={editForm.date}
            onChange={(e) =>
              setEditForm({ ...editForm, date: e.target.value })
            }
            className="rounded-xl"
          />
        </div>

        <div className="space-y-2">
          <Label>Time</Label>
          <Input
            type="time"
            value={editForm.time}
            onChange={(e) =>
              setEditForm({ ...editForm, time: e.target.value })
            }
            className="rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={editForm.status}
            onValueChange={(value) =>
              setEditForm({ ...editForm, status: value })
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Confirmed">Confirmed</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Payment</Label>
          <Select
            value={editForm.paymentStatus}
            onValueChange={(value) =>
              setEditForm({ ...editForm, paymentStatus: value })
            }
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Deposit Paid">Deposit Paid</SelectItem>
              <SelectItem value="Fully Paid">Fully Paid</SelectItem>
              <SelectItem value="Refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>

    <DialogFooter>
      <Button
        variant="outline"
        onClick={() => setIsEditDialogOpen(false)}
        className="rounded-xl"
      >
        Cancel
      </Button>
      <Button onClick={handleEditBooking} className="rounded-xl">
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
      </div>
    </div>
  );
}

function BookingRow({
  booking,
  onDelete,
  onView,
  onUpdateStatus,
  onEdit,
}: {
  booking: Booking;
  onDelete: (id: string) => void;
  onView: (booking: Booking) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onEdit: (booking: Booking) => void;
}) {
  return (
    <tr className="hover:bg-muted/20 transition-colors">
      <td className="px-5 py-4">
        <div>
          <p className="font-medium text-foreground text-sm">{booking.customerName}</p>
          <p className="text-xs text-muted-foreground">{booking.phone}</p>
          <p className="text-xs text-muted-foreground">{booking.email}</p>
        </div>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-foreground">{booking.service}</p>
      </td>
      <td className="px-5 py-4">
        <p className="text-sm text-foreground">
  {new Date(booking.appointment).toLocaleDateString()}
</p>

<p className="text-xs text-muted-foreground">
  {new Date(booking.appointment).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}
</p>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={booking.status} />
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={booking.paymentStatus} />
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
  onClick={() => onView(booking)}
  className="cursor-pointer"
>
  <Eye className="h-4 w-4 mr-2" />
  View Details
</DropdownMenuItem>
            <DropdownMenuItem
  onClick={() => onEdit(booking)}
  className="cursor-pointer"
>
  <Pencil className="h-4 w-4 mr-2" />
  Edit Booking
</DropdownMenuItem>
            <DropdownMenuSeparator />

{['Pending', 'Confirmed', 'Completed', 'Cancelled'].map((status) => (
  <DropdownMenuItem
    key={status}
    onClick={() => onUpdateStatus(booking.id, status)}
    className="cursor-pointer"
  >
    <RefreshCw className="h-4 w-4 mr-2" />
    Mark as {status}
  </DropdownMenuItem>
))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
  onClick={() => onDelete(booking.id)}
  className="cursor-pointer text-red-600 focus:text-red-600"
>
  <Trash2 className="h-4 w-4 mr-2" />
  Delete Booking
</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
