'use client'

export function ContactHero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 bg-secondary">
      <div className="container mx-auto px-6 text-center">
        <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
          Get In Touch
        </p>
        <h1 className="text-5xl md:text-7xl font-light leading-tight mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
          Contact <span className="italic">Us</span>
        </h1>
        <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
          We would love to hear from you. Reach out to us with any questions, or visit us at our clinic.
        </p>
      </div>
    </section>
  )
}

