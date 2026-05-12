'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-40 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?q=80&w=2070&auto=format&fit=crop"
          alt="Luxury spa environment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <div className={`max-w-3xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary-foreground/80 mb-6">
            Begin Your Journey
          </p>
          <h2 className="text-4xl md:text-6xl font-light leading-tight text-primary-foreground mb-8">
            Ready to Reveal Your
            <br />
            <span className="italic">Natural Glow?</span>
          </h2>
          <p className="font-sans text-lg text-primary-foreground/80 max-w-xl mx-auto mb-12 leading-relaxed">
            Book your consultation today and let our experts create a personalized treatment plan just for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
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
              className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 font-sans text-sm tracking-widest uppercase px-10 py-6 rounded-none"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

