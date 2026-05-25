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
import { Download, Mail, MessageSquare, Phone, RefreshCw, Search } from 'lucide-react';

type Enquiry = {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  message: string;
  source?: string;
  status: string;
  createdAt: string;
};

type StatusHistory = {
  status: string;
  at: string;
};

const statusOptions = ['All', 'New', 'Contacted', 'Closed'];
const sourceOptions = ['All', 'Website Form', 'WhatsApp', 'Instagram', 'Manual'];
const pageSizeOptions = [10, 25, 50];

const normalizeStatus = (status: string) => {
  const value = status.toLowerCase();
  if (value === 'contacted') return 'Contacted';
  if (value === 'closed') return 'Closed';
  return 'New';
};

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

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sourceFilter, setSourceFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<Record<string, StatusHistory[]>>({});

  useEffect(() => {
    fetchEnquiries();
    setNotes(JSON.parse(localStorage.getItem('enquiryNotes') || '{}'));
    setHistory(JSON.parse(localStorage.getItem('enquiryStatusHistory') || '{}'));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, sourceFilter, pageSize]);

  const fetchEnquiries = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await apiFetch('/enquiries');
      setEnquiries(Array.isArray(response) ? response : response.data || []);
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to load enquiries. Check the API connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredEnquiries = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return enquiries.filter((enquiry) => {
      const status = normalizeStatus(enquiry.status);
      const source = enquiry.source || 'Website Form';
      const matchesSearch =
        !query ||
        enquiry.customerName.toLowerCase().includes(query) ||
        enquiry.message.toLowerCase().includes(query) ||
        enquiry.email.toLowerCase().includes(query) ||
        enquiry.phone.toLowerCase().includes(query);
      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      const matchesSource = sourceFilter === 'All' || source === sourceFilter;

      return matchesSearch && matchesStatus && matchesSource;
    });
  }, [enquiries, searchQuery, sourceFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / pageSize));
  const paginatedEnquiries = filteredEnquiries.slice((page - 1) * pageSize, page * pageSize);

  const saveNotes = (enquiryId: string, note: string) => {
    const nextNotes = { ...notes, [enquiryId]: note };
    setNotes(nextNotes);
    localStorage.setItem('enquiryNotes', JSON.stringify(nextNotes));
  };

  const updateStatus = async (enquiry: Enquiry, status: string) => {
    try {
      await apiFetch(`/enquiries/${enquiry.id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });

      const nextHistory = {
        ...history,
        [enquiry.id]: [
          ...(history[enquiry.id] || []),
          { status, at: new Date().toISOString() },
        ],
      };

      setHistory(nextHistory);
      localStorage.setItem('enquiryStatusHistory', JSON.stringify(nextHistory));
      await fetchEnquiries();
    } catch (error) {
      console.error(error);
      setErrorMessage('Unable to update enquiry status.');
    }
  };

  const exportFilteredEnquiries = () => {
    downloadCsv(
      'filtered-enquiries.csv',
      filteredEnquiries.map((enquiry) => ({
        customerName: enquiry.customerName,
        email: enquiry.email,
        phone: enquiry.phone,
        source: enquiry.source || 'Website Form',
        status: normalizeStatus(enquiry.status),
        createdAt: new Date(enquiry.createdAt).toLocaleString(),
        message: enquiry.message,
        adminNote: notes[enquiry.id] || '',
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, message, email, or phone..."
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

          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="h-11 w-[155px] rounded-xl bg-card">
              <SelectValue placeholder="Source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((source) => (
                <SelectItem key={source} value={source}>{source}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" className="h-11 rounded-xl" onClick={fetchEnquiries}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" className="h-11 rounded-xl" onClick={exportFilteredEnquiries} disabled={filteredEnquiries.length === 0}>
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
        <Metric label="Total" value={enquiries.length} />
        <Metric label="New" value={enquiries.filter((enquiry) => normalizeStatus(enquiry.status) === 'New').length} />
        <Metric label="Contacted" value={enquiries.filter((enquiry) => normalizeStatus(enquiry.status) === 'Contacted').length} />
        <Metric label="Filtered" value={filteredEnquiries.length} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {paginatedEnquiries.map((enquiry) => (
          <div key={enquiry.id} className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{enquiry.customerName}</p>
                <p className="text-xs text-muted-foreground">{enquiry.source || 'Website Form'} · {new Date(enquiry.createdAt).toLocaleDateString()}</p>
              </div>
              <StatusBadge status={normalizeStatus(enquiry.status)} />
            </div>

            <p className="mb-4 rounded-xl bg-muted/30 p-4 text-sm leading-relaxed">{enquiry.message}</p>

            <div className="mb-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{enquiry.phone}</span>
              <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{enquiry.email}</span>
              {notes[enquiry.id] && <span className="flex items-center gap-1"><MessageSquare className="h-3 w-3" />Has note</span>}
            </div>

            <div className="flex flex-wrap gap-2 border-t pt-4">
              <Button variant="outline" size="sm" className="rounded-lg" onClick={() => setSelectedEnquiry(enquiry)}>
                View / Notes
              </Button>
              {['New', 'Contacted', 'Closed'].map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  size="sm"
                  className="rounded-lg"
                  onClick={() => updateStatus(enquiry, status)}
                  disabled={normalizeStatus(enquiry.status) === status}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {!isLoading && filteredEnquiries.length === 0 && (
        <EmptyState title="No enquiries found" description="Try changing the search term or filters." />
      )}

      {isLoading && (
        <EmptyState title="Loading enquiries" description="Fetching latest enquiry records..." />
      )}

      <Pagination
        page={page}
        pageSize={pageSize}
        total={filteredEnquiries.length}
        totalPages={totalPages}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <Dialog open={Boolean(selectedEnquiry)} onOpenChange={(open) => !open && setSelectedEnquiry(null)}>
        <DialogContent className="sm:max-w-[680px] rounded-2xl">
          {selectedEnquiry && (
            <>
              <DialogHeader>
                <DialogTitle>Enquiry Details</DialogTitle>
                <DialogDescription>Review enquiry details, admin notes, and local status history.</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="rounded-xl border p-4">
                  <p className="font-medium">{selectedEnquiry.customerName}</p>
                  <p className="text-sm text-muted-foreground">{selectedEnquiry.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedEnquiry.phone}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enquiryNote">Admin remarks</Label>
                  <textarea
                    id="enquiryNote"
                    value={notes[selectedEnquiry.id] || ''}
                    onChange={(event) => saveNotes(selectedEnquiry.id, event.target.value)}
                    className="min-h-28 w-full rounded-xl border bg-background p-3 text-sm"
                    placeholder="Add internal follow-up notes, customer preferences, or call outcome..."
                  />
                </div>

                <div className="rounded-xl border p-4">
                  <p className="mb-3 text-sm font-medium">Status history</p>
                  {(history[selectedEnquiry.id] || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No local status changes recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {history[selectedEnquiry.id].map((entry, index) => (
                        <p key={`${entry.at}-${index}`} className="text-sm text-muted-foreground">
                          {entry.status} · {new Date(entry.at).toLocaleString()}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button className="rounded-xl" onClick={() => setSelectedEnquiry(null)}>Done</Button>
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
    <div className="rounded-2xl border border-border/50 bg-card p-12 text-center">
      <MessageSquare className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
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
    <div className="flex flex-col gap-3 rounded-2xl border border-border/50 bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
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
