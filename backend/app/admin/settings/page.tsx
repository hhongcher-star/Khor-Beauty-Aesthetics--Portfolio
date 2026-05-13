'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Globe,
  Save,
  CheckCircle,
} from 'lucide-react';

export default function SettingsPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Success Message */}
      {isSaved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">Settings saved successfully!</p>
        </div>
      )}

      {/* Business Information */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-border/50 bg-muted/20">
          <div className="p-2 rounded-lg bg-secondary/50">
            <Building2 className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Business Information</h2>
            <p className="text-xs text-muted-foreground">Basic details about your business</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              defaultValue="Khor Beauty Aesthetics"
              className="rounded-xl max-w-md"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Short Description</Label>
            <Textarea
              id="description"
              defaultValue="Premium home-service medical aesthetics providing professional skincare treatments at your doorstep."
              className="rounded-xl max-w-lg min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessType">Business Type</Label>
            <Input
              id="businessType"
              defaultValue="Home-Service Medical Aesthetics"
              className="rounded-xl max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-border/50 bg-muted/20">
          <div className="p-2 rounded-lg bg-secondary/50">
            <Phone className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Contact Details</h2>
            <p className="text-xs text-muted-foreground">How customers can reach you</p>
          </div>
        </div>
        <div className="p-5 grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              Phone Number
            </Label>
            <Input
              id="phone"
              defaultValue="+60 12-345 6789"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsapp" className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              WhatsApp Number
            </Label>
            <Input
              id="whatsapp"
              defaultValue="+60 12-345 6789"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue="hello@khorbeauty.com"
              className="rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="serviceArea" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Service Area
            </Label>
            <Input
              id="serviceArea"
              defaultValue="Klang Valley, Selangor"
              className="rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-border/50 bg-muted/20">
          <div className="p-2 rounded-lg bg-secondary/50">
            <Instagram className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Social Media Links</h2>
            <p className="text-xs text-muted-foreground">Connect your social profiles</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instagram" className="flex items-center gap-2">
              <Instagram className="h-4 w-4 text-muted-foreground" />
              Instagram URL
            </Label>
            <Input
              id="instagram"
              defaultValue="https://instagram.com/khorbeauty"
              className="rounded-xl max-w-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook" className="flex items-center gap-2">
              <Facebook className="h-4 w-4 text-muted-foreground" />
              Facebook URL
            </Label>
            <Input
              id="facebook"
              defaultValue="https://facebook.com/khorbeauty"
              className="rounded-xl max-w-lg"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tiktok" className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              TikTok URL
            </Label>
            <Input
              id="tiktok"
              placeholder="https://tiktok.com/@khorbeauty"
              className="rounded-xl max-w-lg"
            />
          </div>
        </div>
      </div>

      {/* Website Display Settings */}
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 p-5 border-b border-border/50 bg-muted/20">
          <div className="p-2 rounded-lg bg-secondary/50">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Website Display Settings</h2>
            <p className="text-xs text-muted-foreground">Customize website content</p>
          </div>
        </div>
        <div className="p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="announcement">Homepage Announcement</Label>
            <Input
              id="announcement"
              defaultValue="Book now and get 10% off your first treatment!"
              className="rounded-xl max-w-lg"
            />
            <p className="text-xs text-muted-foreground">Leave empty to hide the announcement bar</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              defaultValue="Experience luxury medical aesthetics treatments in the comfort of your own home."
              className="rounded-xl max-w-lg min-h-[80px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bookingCta">Booking CTA Text</Label>
            <Input
              id="bookingCta"
              defaultValue="Book Your Home Session"
              className="rounded-xl max-w-md"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSave}
          className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-md shadow-primary/20"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
