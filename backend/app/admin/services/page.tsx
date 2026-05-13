'use client';

import { useState } from 'react';
import { StatusBadge } from '@/components/admin/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Clock,
  Sparkles,
  ImageIcon,
} from 'lucide-react';
import { mockServices, type Service } from '@/lib/mock-data';

const categoryOptions = [
  'All',
  'Skin Booster',
  'Facial Treatment',
  'Anti-Aging',
  'Brightening',
  'Hydration',
  'Body Treatment',
  'Other',
];

export default function ServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/50"
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px] h-11 rounded-xl bg-card border-border/50">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20">
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] rounded-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-serif text-xl">Add New Service</DialogTitle>
                <DialogDescription>
                  Create a new service to display on your website.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="serviceName">Service Name</Label>
                  <Input id="serviceName" placeholder="e.g. Skin Booster Treatment" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.slice(1).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe this service..."
                    className="rounded-xl min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (RM)</Label>
                    <Input id="price" type="number" placeholder="288" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="90 mins" className="rounded-xl" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Service Image</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                    <p className="text-xs text-muted-foreground/70">PNG, JPG up to 5MB</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <Label htmlFor="active">Active Status</Label>
                    <p className="text-xs text-muted-foreground">Service will be visible on website</p>
                  </div>
                  <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={() => setIsAddDialogOpen(false)} className="rounded-xl bg-primary hover:bg-primary/90">
                  Save Service
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-foreground">{mockServices.length}</p>
          <p className="text-xs text-muted-foreground">Total Services</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-emerald-600">
            {mockServices.filter((s) => s.isActive).length}
          </p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-gray-600">
            {mockServices.filter((s) => !s.isActive).length}
          </p>
          <p className="text-xs text-muted-foreground">Inactive</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-foreground">
            {new Set(mockServices.map((s) => s.category)).size}
          </p>
          <p className="text-xs text-muted-foreground">Categories</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No services found</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-secondary/50 via-muted to-accent/30 flex items-center justify-center">
        <Sparkles className="h-12 w-12 text-primary/30" />
        <div className="absolute top-3 right-3">
          <StatusBadge status={service.isActive ? 'Active' : 'Inactive'} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="mb-3">
          <span className="inline-block px-2.5 py-1 rounded-full bg-secondary/50 text-xs font-medium text-muted-foreground">
            {service.category}
          </span>
        </div>
        <h3 className="font-semibold text-foreground mb-2">{service.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{service.description}</p>

        <div className="flex items-center justify-between text-sm mb-4">
          <span className="font-semibold text-primary">RM {service.price}</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            {service.duration}
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-4 border-t border-border/50">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-9 rounded-lg text-xs border-border/50 hover:bg-secondary/30"
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 rounded-lg text-xs border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
