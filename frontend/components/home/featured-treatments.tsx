'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const treatments = [
  {
    id: 1,
    name: 'Hydra Glow Facial',
    description: 'Deep hydration treatment that leaves your skin luminous and refreshed.',
    duration: '60 min',
    price: '$180',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    name: 'Korean Glass Skin',
    description: 'Achieve the coveted dewy, translucent complexion with our signature treatment.',
    duration: '90 min',
    price: '$250',
    image: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 3,
    name: 'Anti-Aging Rejuvenation',
    description: 'Turn back time with advanced treatments targeting fine lines and wrinkles.',
    duration: '75 min',
    price: '$320',
    image: 'https://images.unsplash.com/photo-1552693673-1bf958298935?q=80&w=2073&auto=format&fit=crop',
  },
]

export function FeaturedTreatments() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-secondary">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Featured Treatments
          </p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight">
            Signature <span className="italic">Experiences</span>
          </h2>
        </div>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {treatments.map((treatment, index) => (
            <div
              key={treatment.id}
              className={`group bg-card rounded-lg overflow-hidden transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 200}ms` }}
            >
              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={treatment.image}
                  alt={treatment.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-sans text-xs tracking-wider uppercase text-primary">
                    {treatment.duration}
                  </span>
                  <span className="font-sans text-lg font-medium text-foreground">
                    {treatment.price}
                  </span>
                </div>
                <h3 className="text-2xl font-light mb-3">{treatment.name}</h3>
                <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-6">
                  {treatment.description}
                </p>
                <Link
                  href="/booking"
                  className="inline-flex items-center font-sans text-sm tracking-wider uppercase text-primary hover:text-primary/80 transition-colors"
                >
                  Book Now
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className={`text-center mt-12 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <Link
            href="/services"
            className="inline-flex items-center font-sans text-sm tracking-widest uppercase text-foreground hover:text-primary transition-colors"
          >
            View All Services
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
