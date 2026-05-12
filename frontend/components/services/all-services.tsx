'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const services = [
  {
    category: 'Facial Treatments',
    id: 'facials',
    items: [
      { name: 'Hydra Glow Facial', duration: '60 min', price: '$180', description: 'Deep hydration for luminous, refreshed skin.' },
      { name: 'Korean Glass Skin', duration: '90 min', price: '$250', description: 'Achieve the coveted dewy, translucent complexion.' },
      { name: 'Deep Cleansing Facial', duration: '45 min', price: '$120', description: 'Thorough cleansing and pore purification.' },
      { name: 'Brightening Facial', duration: '60 min', price: '$160', description: 'Target dullness and uneven skin tone.' },
    ],
  },
  {
    category: 'Anti-Aging',
    id: 'anti-aging',
    items: [
      { name: 'Anti-Aging Rejuvenation', duration: '75 min', price: '$320', description: 'Advanced treatment for fine lines and wrinkles.' },
      { name: 'Collagen Boost Treatment', duration: '60 min', price: '$280', description: 'Stimulate natural collagen production.' },
      { name: 'Lifting & Firming', duration: '90 min', price: '$350', description: 'Non-invasive facial lifting and tightening.' },
      { name: 'Eye Rejuvenation', duration: '30 min', price: '$120', description: 'Target crow\'s feet and under-eye concerns.' },
    ],
  },
  {
    category: 'Skin Treatments',
    id: 'treatments',
    items: [
      { name: 'Acne Treatment', duration: '60 min', price: '$180', description: 'Clear and prevent breakouts effectively.' },
      { name: 'Pigmentation Correction', duration: '75 min', price: '$220', description: 'Even out skin tone and reduce dark spots.' },
      { name: 'Chemical Peel', duration: '45 min', price: '$150', description: 'Exfoliate and renew skin surface.' },
      { name: 'Microneedling', duration: '60 min', price: '$300', description: 'Stimulate skin renewal and improve texture.' },
    ],
  },
  {
    category: 'Body Contouring',
    id: 'body',
    items: [
      { name: 'Body Sculpting', duration: '90 min', price: '$400', description: 'Non-invasive fat reduction and toning.' },
      { name: 'Cellulite Treatment', duration: '60 min', price: '$250', description: 'Smooth and firm problem areas.' },
      { name: 'Skin Tightening', duration: '75 min', price: '$320', description: 'Improve skin elasticity and firmness.' },
    ],
  },
]

export function AllServices() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.05 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        {services.map((category, categoryIndex) => (
          <div
            key={category.id}
            id={category.id}
            className={`mb-16 last:mb-0 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            style={{ transitionDelay: `${categoryIndex * 150}ms` }}
          >
            {/* Category Header */}
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-light">{category.category}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {category.items.map((service) => (
                <div
                  key={service.name}
                  className="group bg-card p-6 rounded-lg hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-light mb-2 group-hover:text-primary transition-colors">
                        {service.name}
                      </h3>
                      <p className="font-sans text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-light text-primary">{service.price}</p>
                      <p className="font-sans text-xs text-muted-foreground uppercase tracking-wider">
                        {service.duration}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/booking"
                    className="inline-flex items-center font-sans text-sm tracking-wider uppercase text-primary hover:text-primary/80 transition-colors"
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

