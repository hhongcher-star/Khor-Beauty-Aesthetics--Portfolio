'use client';


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
  Search,
  Download,
  MessageSquare,
  Phone,
  Mail,
  CheckCircle,
  Instagram,
  Globe,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

const statusOptions = ['All', 'new', 'contacted', 'closed'];
const sourceOptions = ['All', 'Website Form', 'WhatsApp', 'Instagram', 'Manual'];

export default function EnquiriesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [enquiries, setEnquiries] = useState<any[]>([]);
  useEffect(() => {
  fetchEnquiries();
}, []);

const fetchEnquiries = async () => {
  try {
    const response = await apiFetch('/enquiries');

    if (Array.isArray(response)) {
      setEnquiries(response);
    } else {
      setEnquiries(response.data || []);
    }
  } catch (error) {
    console.error(error);
    setEnquiries([]);
  }
};
const handleMarkContacted = async (id: string) => {
  try {
    await apiFetch(`/enquiries/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'contacted',
      }),
    });

    fetchEnquiries();
  } catch (error) {
    console.error(error);
  }
};

const filteredEnquiries = enquiries.filter((enquiry) => {
  const matchesSearch =
    enquiry.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    enquiry.email.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesStatus =
    statusFilter === 'All' ||
    enquiry.status === statusFilter;

  return matchesSearch && matchesStatus;
});

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search enquiries..."
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
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[150px] h-11 rounded-xl bg-card border-border/50">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((source) => (
                <SelectItem key={source} value={source}>
                  {source}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="h-11 rounded-xl border-border/50 hover:bg-secondary/30"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-foreground">{enquiries.length}</p>
          <p className="text-xs text-muted-foreground">Total Enquiries</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-pink-600">
            {enquiries.filter((e) => e.status === 'new').length}
          </p>
          <p className="text-xs text-muted-foreground">New</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-blue-600">
            {enquiries.filter((e) => e.status === 'contacted').length}
          </p>
          <p className="text-xs text-muted-foreground">Contacted</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-gray-600">
            {enquiries.filter((e) => e.status === 'closed').length}
          </p>
          <p className="text-xs text-muted-foreground">Closed</p>
        </div>
      </div>

      {/* Enquiries Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEnquiries.map((enquiry) => (
          <EnquiryCard
  key={enquiry.id}
  enquiry={enquiry}
  onMarkContacted={handleMarkContacted}
/>
        ))}
      </div>

      {filteredEnquiries.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No enquiries found</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

function EnquiryCard({
  enquiry,
  onMarkContacted,
}: {
  enquiry: any;
  onMarkContacted: (id: string) => void;
}) {
  

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'WhatsApp':
        return <Phone className="h-4 w-4" />;
      case 'Instagram':
        return <Instagram className="h-4 w-4" />;
      case 'Website Form':
        return <Globe className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm p-5 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center">
            <span className="text-sm font-medium text-foreground">
              {enquiry.customerName.split(' ').map((n) => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="font-medium text-foreground">{enquiry.customerName}</p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {getSourceIcon('Website Form')}
<span>Website Form</span>
            </div>
          </div>
        </div>
        <StatusBadge status={enquiry.status} />
      </div>

      {/* Message */}
      <div className="bg-muted/30 rounded-xl p-4 mb-4">
        <p className="text-sm text-foreground leading-relaxed">{enquiry.message}</p>
      </div>

      {/* Contact Info */}
      <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-4">
        <span className="flex items-center gap-1">
          <Phone className="h-3 w-3" />
          {enquiry.phone}
        </span>
        <span className="flex items-center gap-1">
          <Mail className="h-3 w-3" />
          {enquiry.email}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <p className="text-xs text-muted-foreground">{new Date(enquiry.createdAt).toLocaleDateString()}</p>
        <div className="flex items-center gap-2">
          <Button
  variant="outline"
  size="sm"
  onClick={() => onMarkContacted(enquiry.id)}
  className="h-8 rounded-lg text-xs border-border/50 hover:bg-secondary/30"
>
  <CheckCircle className="h-3 w-3 mr-1" />
  Mark Contacted
</Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
          >
            <Phone className="h-3 w-3 mr-1" />
            WhatsApp
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-lg text-xs border-border/50 hover:bg-secondary/30"
          >
            <Mail className="h-3 w-3 mr-1" />
            Email
          </Button>
        </div>
      </div>
    </div>
  );
}
