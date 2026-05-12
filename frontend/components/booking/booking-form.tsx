'use client'

import { useState } from 'react'
import { format, addDays, isSameDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight, Check, MessageCircle } from 'lucide-react'

const treatments = [
  { id: 'hydra-glow', name: 'Hydra Glow Facial', duration: '60 min', price: '$180' },
  { id: 'glass-skin', name: 'Korean Glass Skin', duration: '90 min', price: '$250' },
  { id: 'anti-aging', name: 'Anti-Aging Rejuvenation', duration: '75 min', price: '$320' },
  { id: 'deep-cleansing', name: 'Deep Cleansing Facial', duration: '45 min', price: '$120' },
  { id: 'brightening', name: 'Brightening Facial', duration: '60 min', price: '$160' },
  { id: 'collagen-boost', name: 'Collagen Boost Treatment', duration: '60 min', price: '$280' },
  { id: 'acne', name: 'Acne Treatment', duration: '60 min', price: '$180' },
  { id: 'microneedling', name: 'Microneedling', duration: '60 min', price: '$300' },
]

const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
]

export function BookingForm() {
  const [step, setStep] = useState(1)
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDay = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days: (Date | null)[] = []

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today || date.getDay() === 0 // Disable past dates and Sundays
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the booking to your backend
    setStep(4) // Show confirmation
  }

  const selectedTreatmentData = treatments.find(t => t.id === selectedTreatment)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-12">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-sans text-sm transition-colors ${
                step >= s
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 3 && (
              <div
                className={`w-20 md:w-32 h-0.5 transition-colors ${
                  step > s ? 'bg-primary' : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Treatment Selection */}
      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-light text-center mb-8">
            Select Your <span className="italic">Treatment</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {treatments.map((treatment) => (
              <button
                key={treatment.id}
                onClick={() => setSelectedTreatment(treatment.id)}
                className={`p-6 rounded-lg border text-left transition-all ${
                  selectedTreatment === treatment.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-card hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-light text-lg mb-1">{treatment.name}</h3>
                    <p className="font-sans text-sm text-muted-foreground">
                      {treatment.duration}
                    </p>
                  </div>
                  <span className="font-light text-lg text-primary">{treatment.price}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => setStep(2)}
              disabled={!selectedTreatment}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Date & Time Selection */}
      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-light text-center mb-8">
            Choose Date & <span className="italic">Time</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calendar */}
            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setCurrentMonth(addDays(currentMonth, -30))}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h3 className="font-light text-lg">
                  {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <button
                  onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Days of Week */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-sans text-xs text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((date, index) => (
                  <button
                    key={index}
                    onClick={() => date && !isDateDisabled(date) && setSelectedDate(date)}
                    disabled={!date || isDateDisabled(date)}
                    className={`aspect-square flex items-center justify-center font-sans text-sm rounded-lg transition-colors ${
                      !date
                        ? 'invisible'
                        : isDateDisabled(date)
                        ? 'text-muted-foreground/30 cursor-not-allowed'
                        : selectedDate && isSameDay(date, selectedDate)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    {date?.getDate()}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="bg-card p-6 rounded-lg">
              <h3 className="font-light text-lg mb-6">Available Times</h3>
              {selectedDate ? (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-3 px-4 rounded-lg font-sans text-sm transition-colors ${
                        selectedTime === time
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="font-sans text-sm text-muted-foreground">
                  Please select a date first
                </p>
              )}
            </div>
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setStep(1)}
              className="font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              Back
            </Button>
            <Button
              onClick={() => setStep(3)}
              disabled={!selectedDate || !selectedTime}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Customer Information */}
      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-light text-center mb-8">
            Your <span className="italic">Information</span>
          </h2>

          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="font-sans text-sm">First Name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                  className="mt-2 rounded-none border-border"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="font-sans text-sm">Last Name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                  className="mt-2 rounded-none border-border"
                />
              </div>
              <div>
                <Label htmlFor="email" className="font-sans text-sm">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="mt-2 rounded-none border-border"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="font-sans text-sm">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="mt-2 rounded-none border-border"
                />
              </div>
            </div>
            <div className="mt-6">
              <Label htmlFor="notes" className="font-sans text-sm">Special Requests (Optional)</Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
                className="mt-2 w-full px-3 py-2 border border-border bg-background rounded-none resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Booking Summary */}
            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="font-light text-lg mb-4">Booking Summary</h3>
              <div className="space-y-2 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Treatment</span>
                  <span>{selectedTreatmentData?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time</span>
                  <span>{selectedTime}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-muted-foreground">Total</span>
                  <span className="text-primary font-medium">{selectedTreatmentData?.price}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(2)}
                className="font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
              >
                Back
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
              >
                Confirm Booking
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="animate-fade-in text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-primary-foreground" />
          </div>
          <h2 className="text-3xl font-light mb-4">
            Booking <span className="italic">Confirmed!</span>
          </h2>
          <p className="font-sans text-muted-foreground max-w-md mx-auto mb-8">
            Thank you for your booking. We have sent a confirmation email to {formData.email}. We look forward to seeing you!
          </p>

          <div className="bg-card p-6 rounded-lg max-w-md mx-auto mb-8">
            <div className="space-y-2 font-sans text-sm text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Treatment</span>
                <span>{selectedTreatmentData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span>{selectedDate && format(selectedDate, 'EEEE, MMMM d, yyyy')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Time</span>
                <span>{selectedTime}</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Contact */}
          <a
            href="https://wa.me/821012345678"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-lg font-sans text-sm hover:bg-[#25D366]/90 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            Contact us on WhatsApp
          </a>
        </div>
      )}
    </div>
  )
}
