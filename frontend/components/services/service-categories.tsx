'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, Clock, Zap, Heart, Droplets, Sun, Smile } from 'lucide-react'

type Service = {
  id: string
  name: string
  description: string
  price: number
  category?: string | null
  active: boolean
}

type ServiceCategoriesProps = {
  services?: Service[]
}

const CATEGORY_INFO = [
  {
    title: 'Skin Booster',
    icon: Sparkles,
    description: 'Improve skin radiance, hydration, and overall skin quality.',
  },
  {
    title: 'Facial Treatment',
    icon: Smile,
    description: 'Deep cleansing, hydration, and rejuvenation facials tailored to your skin type.',
  },
  {
    title: 'Anti-Aging',
    icon: Clock,
    description: 'Advanced treatments targeting fine lines, firmness, and youthful skin.',
  },
  {
    title: 'Brightening',
    icon: Sun,
    description: 'Treat dullness, uneven skin tone, pigmentation, and glow concerns.',
  },
  {
    title: 'Hydration',
    icon: Droplets,
    description: 'Restore moisture balance and improve dry or dehydrated skin.',
  },
  {
    title: 'Body Treatment',
    icon: Heart,
    description: 'Sculpt, firm, and improve body skin appearance with non-invasive treatments.',
  },
  {
    title: 'Other',
    icon: Zap,
    description: 'Other personalised aesthetic and beauty treatments.',
  },
]

export function ServiceCategories({ services = [] }: ServiceCategoriesProps) {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)

    return () => observer.disconnect()
  }, [])

  const activeServices = services.filter((service) => service.active)

  const categories = CATEGORY_INFO.map((category) => {
    const count = activeServices.filter(
      (service) => (service.category || 'Other') === category.title
    ).length

    return {
      ...category,
      count,
    }
  }).filter((category) => category.count > 0)

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className={`group p-8 border border-border rounded-lg hover:bg-secondary/50 transition-all duration-500 cursor-pointer ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <category.icon className="w-10 h-10 text-primary mb-6 transition-transform group-hover:scale-110" />

              <h3 className="text-xl font-light mb-3">{category.title}</h3>

              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
                {category.description}
              </p>

              <span className="font-sans text-xs tracking-wider uppercase text-primary">
                {category.count} {category.count === 1 ? 'Service' : 'Services'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}