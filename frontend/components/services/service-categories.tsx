'use client'

import { useEffect, useRef, useState } from 'react'
import { Sparkles, Clock, Zap, Heart } from 'lucide-react'

const categories = [
  {
    icon: Sparkles,
    title: 'Facial Treatments',
    description: 'Deep cleansing, hydration, and rejuvenation facials tailored to your skin type.',
    count: '12 Services',
  },
  {
    icon: Clock,
    title: 'Anti-Aging',
    description: 'Turn back time with advanced treatments targeting fine lines and wrinkles.',
    count: '8 Services',
  },
  {
    icon: Zap,
    title: 'Skin Treatments',
    description: 'Address specific concerns like acne, pigmentation, and texture issues.',
    count: '10 Services',
  },
  {
    icon: Heart,
    title: 'Body Contouring',
    description: 'Sculpt and tone your body with non-invasive body treatments.',
    count: '6 Services',
  },
]

export function ServiceCategories() {
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
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className={`group p-8 border border-border rounded-lg hover:bg-secondary/50 transition-all duration-500 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <category.icon className="w-10 h-10 text-primary mb-6 transition-transform group-hover:scale-110" />
              <h3 className="text-xl font-light mb-3">{category.title}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed mb-4">
                {category.description}
              </p>
              <span className="font-sans text-xs tracking-wider uppercase text-primary">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
