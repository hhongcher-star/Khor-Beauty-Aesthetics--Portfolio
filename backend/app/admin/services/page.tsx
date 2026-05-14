'use client';

import { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { apiFetch } from '@/lib/api';


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
  const [services, setServices] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [serviceName, setServiceName] = useState('');
  const [serviceDescription, setServiceDescription] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any | null>(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServiceDescription, setEditServiceDescription] = useState('');
  const [editServicePrice, setEditServicePrice] = useState('');
  const [editIsActive, setEditIsActive] = useState(true);
  const [serviceCategory, setServiceCategory] = useState('');
  const [editServiceCategory, setEditServiceCategory] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);


  const fetchServices = async () => {
  try {
    const response = await apiFetch('/services');

    if (Array.isArray(response)) {
      setServices(response);
    } else {
      setServices(response.data || []);
    }
  } catch (error) {
    console.error(error);
    setServices([]);
  }
};

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const handleAddService = async () => {
  if (!serviceName || !serviceDescription || !servicePrice || !serviceCategory) {
    alert('Please fill in all required fields.');
    return;
  }

  if (Number(servicePrice) <= 0) {
    alert('Price must be greater than 0.');
    return;
  }

  if (!categoryOptions.slice(1).includes(serviceCategory)) {
    alert('Invalid category selected.');
    return;
  }

  try {
    await apiFetch('/services', {
      method: 'POST',
      body: JSON.stringify({
        name: serviceName.trim(),
        description: serviceDescription.trim(),
        price: Number(servicePrice),
        category: serviceCategory,
        active: isActive,
      }),
    });

    setServiceName('');
    setServiceDescription('');
    setServicePrice('');
    setServiceCategory('');
    setIsActive(true);

    setIsAddDialogOpen(false);
    fetchServices();
  } catch (error) {
    console.error(error);
  }
};
  const handleDeleteService = async () => {
  if (!deleteServiceId) return;

  try {
    await apiFetch(`/services/${deleteServiceId}`, {
      method: 'DELETE',
    });

    setDeleteServiceId(null);

    fetchServices();
  } catch (error) {
    console.error(error);
  }
};
const handleEditClick = (service: any) => {
  setSelectedService(service);
  setEditServiceName(service.name);
  setEditServiceDescription(service.description);
  setEditServicePrice(String(service.price));
  setEditIsActive(service.active);
  setIsEditDialogOpen(true);
};
const handleUpdateService = async () => {
  if (!selectedService) return;

  try {
    await apiFetch(`/services/${selectedService.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: editServiceName,
        description: editServiceDescription,
        price: Number(editServicePrice),
        active: editIsActive,
      }),
    });

    setIsEditDialogOpen(false);
    setSelectedService(null);

    fetchServices();
  } catch (error) {
    console.error(error);
  }
};
const [deleteServiceId, setDeleteServiceId] = useState<string | null>(null);


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
                  <Input id="serviceName" value={serviceName} onChange={(e) => setServiceName(e.target.value)} placeholder="e.g. Skin Booster Treatment" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
  value={serviceCategory}
  onValueChange={setServiceCategory}
>
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
                    value={serviceDescription}
                      onChange={(e) => setServiceDescription(e.target.value)}
                    placeholder="Describe this service..."
                    className="rounded-xl min-h-[100px]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price (RM)</Label>
                    <Input id="price" type="number" value={servicePrice} onChange={(e) => setServicePrice(e.target.value)} placeholder="288" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="90 mins" className="rounded-xl" />
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
                <Button onClick={handleAddService} className="rounded-xl bg-primary hover:bg-primary/90">
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
          <p className="text-2xl font-semibold text-foreground">{services.length}</p>
          <p className="text-xs text-muted-foreground">Total Services</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-emerald-600">
            {services.filter((s) => s.active).length}
          </p>
          <p className="text-xs text-muted-foreground">Active</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-gray-600">
            {services.filter((s) => !s.active).length}
          </p>
          <p className="text-xs text-muted-foreground">Inactive</p>
        </div>
        <div className="bg-card rounded-xl p-4 border border-border/50">
          <p className="text-2xl font-semibold text-foreground">
            {new Set(services.map((s) => s.category)).size}
          </p>
          <p className="text-xs text-muted-foreground">Categories</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <ServiceCard
  key={service.id}
  service={service}
  onEdit={handleEditClick}
  onDelete={(id) => setDeleteServiceId(id)}
/>
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
          <Sparkles className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No services found</p>
          <p className="text-sm text-muted-foreground/70">Try adjusting your search or filters</p>
          
        </div>
      )}

      <Dialog
        open={!!deleteServiceId}
        onOpenChange={() => setDeleteServiceId(null)}
      >
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteServiceId(null)}
              className="rounded-xl"
            >
              Cancel
            </Button>

            <Button
              onClick={handleDeleteService}
              className="rounded-xl bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog
  open={isEditDialogOpen}
  onOpenChange={(open) => {
    setIsEditDialogOpen(open);

    if (!open) {
      setSelectedService(null);
    }
  }}
>
  <DialogContent className="sm:max-w-[550px] rounded-2xl">
    <DialogHeader>
      <DialogTitle>Edit Service</DialogTitle>
      <DialogDescription>
        Update this service information.
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label>Service Name</Label>
        <Input
          value={editServiceName}
          onChange={(e) => setEditServiceName(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>
        <Textarea
          value={editServiceDescription}
          onChange={(e) => setEditServiceDescription(e.target.value)}
          className="rounded-xl min-h-[100px]"
        />
      </div>

      <div className="space-y-2">
        <Label>Price (RM)</Label>
        <Input
          type="number"
          value={editServicePrice}
          onChange={(e) => setEditServicePrice(e.target.value)}
          className="rounded-xl"
        />
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <Label>Active Status</Label>
          <p className="text-xs text-muted-foreground">
            Service will be visible on website
          </p>
        </div>
        <Switch checked={editIsActive} onCheckedChange={setEditIsActive} />
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

      <Button
        onClick={handleUpdateService}
        className="rounded-xl bg-primary hover:bg-primary/90"
      >
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
    </div>
  );
}

function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: any;
  onEdit: (service: any) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
      {/* Image Placeholder */}
      <div className="relative h-40 bg-gradient-to-br from-secondary/50 via-muted to-accent/30 flex items-center justify-center">
        <Sparkles className="h-12 w-12 text-primary/30" />
        <div className="absolute top-3 right-3">
          <StatusBadge status={service.active ? 'Active' : 'Inactive'} />
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
            onClick={() => onEdit(service)}
            className="flex-1 h-9 rounded-lg text-xs border-border/50 hover:bg-secondary/30"
          >
            <Pencil className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(service.id)}
            className="h-9 rounded-lg text-xs border-red-200 text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
