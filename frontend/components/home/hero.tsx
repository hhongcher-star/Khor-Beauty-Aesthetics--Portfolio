'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Subtitle */}
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-6 animate-fade-in-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
            Premium Korean Beauty
          </p>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-light leading-tight tracking-tight text-balance animate-fade-in-up opacity-0" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
            Discover Your
            <br />
            <span className="italic">Radiant</span> Beauty
          </h1>

          {/* Description */}
          <p className="mt-8 text-lg md:text-xl font-sans text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
            Experience the art of Korean skincare with our expert treatments. Personalized care designed to reveal your natural glow.
          </p>

          {/* CTA Buttons */}
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up opacity-0" style={{ animationDelay: '800ms', animationFillMode: 'forwards' }}>
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              <Link href="/booking">
                Book Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-foreground/30 text-foreground hover:bg-foreground/5 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              <Link href="/services">Explore Services</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1 h-3 bg-foreground/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}

