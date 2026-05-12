import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { BookingForm } from '@/components/booking/booking-form'

export const metadata = {
  title: 'Book Appointment | Lumière Beauty Clinic',
  description: 'Schedule your luxury skincare treatment at Lumière Beauty Clinic. Choose your service, select a date, and experience Korean beauty at its finest.',
}

export default function BookingPage() {
  return (
    <main>
      <Header />
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 bg-secondary min-h-screen">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
              Book Appointment
            </p>
            <h1 className="text-5xl md:text-6xl font-light leading-tight mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              Schedule Your <span className="italic">Visit</span>
            </h1>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
              Select your preferred treatment and book a convenient time. Our team will confirm your appointment shortly.
            </p>
          </div>

          {/* Booking Form */}
          <BookingForm />
        </div>
      </section>
      <Footer />
    </main>
  )
}
