'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Service = {
  id: string
  name: string
  description: string
  price: number
  category?: string | null
  active: boolean
}

type AllServicesProps = {
  services?: Service[]
}

const SERVICE_CATEGORIES = [
  'Skin Booster',
  'Facial Treatment',
  'Anti-Aging',
  'Brightening',
  'Hydration',
  'Body Treatment',
  'Other',
]

export function AllServices({ services = [] }: AllServicesProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.05 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  const groupedServices = SERVICE_CATEGORIES.map((category) => ({
    category,
    items: services.filter(
      (service) =>
        service.active &&
        (service.category || 'Other') === category
    ),
  })).filter((group) => group.items.length > 0)

  return (
    <section ref={sectionRef} className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        {groupedServices.map((group, categoryIndex) => (
          <div
            key={group.category}
            id={group.category.toLowerCase().replace(/\s+/g, '-')}
            className={`mb-16 last:mb-0 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
            style={{ transitionDelay: `${categoryIndex * 150}ms` }}
          >
            <div className="flex items-center gap-4 mb-8">
              <h2 className="text-3xl font-light">{group.category}</h2>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.items.map((service) => (
                <div
                  key={service.id}
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
                      <p className="text-xl font-light text-primary">
                        RM {service.price}
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