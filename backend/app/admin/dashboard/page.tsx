'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/stat-card';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  MessageSquare,
  Sparkles,
  CreditCard,
  Users,
  Plus,
  ArrowRight,
  Eye,
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
type Booking = {
  id: string;
  customerName: string;
  phone: string;
  service: string;
  status: string;
  appointment: string;
};

type Enquiry = {
  id: string;
  customerName: string;
  source: string;
  status: string;
  message: string;
  createdAt: string;
};

type Payment = {
  id: string;
  amount: number;
  status: string;
};

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
const [payments, setPayments] = useState<Payment[]>([]);

useEffect(() => {
  fetchDashboardData();
}, []);

const fetchDashboardData = async () => {
  try {
    const [bookingRes, enquiryRes, paymentRes] = await Promise.all([
      apiFetch('/bookings'),
      apiFetch('/enquiries'),
      apiFetch('/payments'),
    ]);

    setBookings(bookingRes.data || []);
    setEnquiries(enquiryRes.data || []);
    setPayments(paymentRes.data || []);
  } catch (error) {
    console.error(error);
  }
};

const recentBookings = bookings.slice(0, 5);
const recentEnquiries = enquiries.slice(0, 3);

const totalBookings = bookings.length;
const newEnquiries = enquiries.filter((e) => e.status === 'new').length;
const pendingPayments = payments.filter((p) => p.status === 'Pending').length;
const revenue = payments
  .filter((p) => p.status === 'Paid')
  .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/20 to-accent/10 rounded-2xl p-6 border border-border/50">
        <h2 className="text-2xl font-semibold text-foreground">Welcome back!</h2>
        <p className="text-muted-foreground mt-1">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Bookings"
          value={totalBookings}
          icon={Calendar}
          trend={{ value: 12, isPositive: true }}
        />
        <StatCard
          title="New Enquiries"
          value={newEnquiries}
          icon={MessageSquare}
          description="Awaiting response"
        />
        <StatCard
          title="Active Services"
          value="5"
          icon={Sparkles}
        />
        <StatCard
          title="Pending Payments"
          value={pendingPayments}
          icon={CreditCard}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link href="/admin/bookings">
          <Button variant="outline" className="w-full h-auto py-4 rounded-xl border-dashed flex-col gap-2 hover:bg-secondary/30 hover:border-primary/30">
            <Plus className="h-5 w-5 text-primary" />
            <span className="text-sm">New Booking</span>
          </Button>
        </Link>
        <Link href="/admin/enquiries">
          <Button variant="outline" className="w-full h-auto py-4 rounded-xl border-dashed flex-col gap-2 hover:bg-secondary/30 hover:border-primary/30">
            <MessageSquare className="h-5 w-5 text-primary" />
            <span className="text-sm">View Enquiries</span>
          </Button>
        </Link>
        <Link href="/admin/services">
          <Button variant="outline" className="w-full h-auto py-4 rounded-xl border-dashed flex-col gap-2 hover:bg-secondary/30 hover:border-primary/30">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="text-sm">Add Service</span>
          </Button>
        </Link>
        <Link href="/admin/payments">
          <Button variant="outline" className="w-full h-auto py-4 rounded-xl border-dashed flex-col gap-2 hover:bg-secondary/30 hover:border-primary/30">
            <CreditCard className="h-5 w-5 text-primary" />
            <span className="text-sm">View Payments</span>
          </Button>
        </Link>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <h3 className="font-semibold text-foreground">Recent Bookings</h3>
            <Link href="/admin/bookings">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted/30">
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                    Customer
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                    Service
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                    Date & Time
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                    Status
                  </th>
                  <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-5 py-3">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-foreground text-sm">{booking.customerName}</p>
                        <p className="text-xs text-muted-foreground">{booking.phone}</p>
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
                      <Button variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-border/50">
            <h3 className="font-semibold text-foreground">New Enquiries</h3>
            <Link href="/admin/enquiries">
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                View All <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="divide-y divide-border/50">
            {recentEnquiries.map((enquiry) => (
              <div key={enquiry.id} className="p-5 hover:bg-muted/20 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground text-sm">{enquiry.customerName}</p>
                    <p className="text-xs text-muted-foreground">{enquiry.source}</p>
                  </div>
                  <StatusBadge status={enquiry.status} />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{enquiry.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* This Month Stats */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-secondary/50">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">This Month</h3>
            <p className="text-sm text-muted-foreground">Customer activity overview</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 rounded-xl bg-muted/30">
            <p className="text-2xl font-semibold text-foreground">{bookings.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Total Customers</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/30">
            <p className="text-2xl font-semibold text-foreground">28</p>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/30">
            <p className="text-2xl font-semibold text-foreground">6</p>
            <p className="text-xs text-muted-foreground mt-1">Upcoming</p>
          </div>
          <div className="text-center p-4 rounded-xl bg-muted/30">
            <p className="text-2xl font-semibold text-foreground">RM {revenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">Revenue</p>
          </div>
        </div>
      </div>
    </div>
  );
}
