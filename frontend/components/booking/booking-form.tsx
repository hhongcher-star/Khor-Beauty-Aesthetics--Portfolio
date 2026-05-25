'use client'

import { useState } from 'react'
import { format, addDays, isSameDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, ChevronRight, Check, MessageCircle } from 'lucide-react'
import { apiRequest } from '@/lib/api'

type Service = {
  id: string
  name: string
  description: string
  price: number
  category?: string | null
  active: boolean
}

type BookingFormProps = {
  services?: Service[]
}

const timeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

export function BookingForm({ services = [] }: BookingFormProps) {
  const [step, setStep] = useState(1)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })

  const activeServices = services.filter((service) => service.active)

  const selectedServiceData = activeServices.find(
    (service) => service.id === selectedServiceId
  )

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startingDay = firstDay.getDay()
    const totalDays = lastDay.getDate()

    const days: (Date | null)[] = []

    for (let i = 0; i < startingDay; i++) days.push(null)

    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return date < today || date.getDay() === 0
  }

  const buildAppointmentDateTime = () => {
    if (!selectedDate || !selectedTime) return null

    const [hours, minutes] = selectedTime.split(':').map(Number)

    const appointment = new Date(selectedDate)
    appointment.setHours(hours, minutes, 0, 0)

    return appointment
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage('')

    if (!selectedServiceData || !selectedDate || !selectedTime) {
      setErrorMessage('Please complete all booking details.')
      return
    }

    const appointment = buildAppointmentDateTime()

    if (!appointment) {
      setErrorMessage('Invalid appointment date or time.')
      return
    }

    try {
      setIsSubmitting(true)

      await apiRequest('/bookings', {
        method: 'POST',
        body: JSON.stringify({
          customerName: `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          service: selectedServiceData.name,
          appointment: appointment.toISOString(),
        }),
      })

      setStep(4)
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to submit booking. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
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

      {step === 1 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-light text-center mb-8">
            Select Your <span className="italic">Treatment</span>
          </h2>

          {activeServices.length === 0 ? (
            <p className="text-center font-sans text-sm text-muted-foreground">
              No services are currently available for booking.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeServices.map((service) => (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setSelectedServiceId(service.id)}
                  className={`p-6 rounded-lg border text-left transition-all ${
                    selectedServiceId === service.id
                      ? 'border-primary bg-primary/5'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-light text-lg mb-1">{service.name}</h3>
                      <p className="font-sans text-sm text-muted-foreground">
                        {service.description}
                      </p>
                      {service.category && (
                        <p className="font-sans text-xs text-primary uppercase tracking-wider mt-3">
                          {service.category}
                        </p>
                      )}
                    </div>

                    <span className="font-light text-lg text-primary whitespace-nowrap">
                      RM {service.price}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex justify-end">
            <Button
              type="button"
              onClick={() => setStep(2)}
              disabled={!selectedServiceId}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-light text-center mb-8">
            Choose Date & <span className="italic">Time</span>
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-card p-6 rounded-lg">
              <div className="flex items-center justify-between mb-6">
                <button
                  type="button"
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
                  type="button"
                  onClick={() => setCurrentMonth(addDays(currentMonth, 30))}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div
                    key={day}
                    className="text-center font-sans text-xs text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((date, index) => (
                  <button
                    key={index}
                    type="button"
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

            <div className="bg-card p-6 rounded-lg">
              <h3 className="font-light text-lg mb-6">Available Times</h3>

              {selectedDate ? (
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
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
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              Back
            </Button>

            <Button
              type="button"
              onClick={() => setStep(3)}
              disabled={!selectedDate || !selectedTime}
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-fade-in">
          <h2 className="text-2xl font-light text-center mb-8">
            Your <span className="italic">Information</span>
          </h2>

          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-lg">
            {errorMessage && (
              <div className="mb-6 p-4 bg-destructive/10 text-destructive font-sans text-sm rounded-lg">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="firstName" className="font-sans text-sm">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  required
                  className="mt-2 rounded-none border-border"
                />
              </div>

              <div>
                <Label htmlFor="lastName" className="font-sans text-sm">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  className="mt-2 rounded-none border-border"
                />
              </div>

              <div>
                <Label htmlFor="email" className="font-sans text-sm">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="mt-2 rounded-none border-border"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="font-sans text-sm">
                  Phone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  required
                  className="mt-2 rounded-none border-border"
                />
              </div>
            </div>

            <div className="mt-6">
              <Label htmlFor="notes" className="font-sans text-sm">
                Special Requests (Optional)
              </Label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={3}
                className="mt-2 w-full px-3 py-2 border border-border bg-background rounded-none resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="mt-8 p-6 bg-muted rounded-lg">
              <h3 className="font-light text-lg mb-4">Booking Summary</h3>

              <div className="space-y-2 font-sans text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Treatment</span>
                  <span>{selectedServiceData?.name}</span>
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
                  <span className="text-primary font-medium">
                    RM {selectedServiceData?.price}
                  </span>
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
                disabled={isSubmitting}
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
              >
                {isSubmitting ? 'Submitting...' : 'Confirm Booking'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {step === 4 && (
        <div className="animate-fade-in text-center">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-8">
            <Check className="w-10 h-10 text-primary-foreground" />
          </div>

          <h2 className="text-3xl font-light mb-4">
            Booking <span className="italic">Submitted!</span>
          </h2>

          <p className="font-sans text-muted-foreground max-w-md mx-auto mb-8">
            Thank you for your booking. Our team will contact you shortly to confirm your appointment.
          </p>

          <div className="bg-card p-6 rounded-lg max-w-md mx-auto mb-8">
            <div className="space-y-2 font-sans text-sm text-left">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Treatment</span>
                <span>{selectedServiceData?.name}</span>
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

          <a
            href="https://wa.me/60123456789"
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
