'use client'

import { useEffect, useRef, useState } from 'react'
import { Heart, Leaf, Award, Users } from 'lucide-react'

const values = [
  {
    icon: Heart,
    title: 'Personalized Care',
    description: 'Every treatment is tailored to your unique skin needs and beauty goals.',
  },
  {
    icon: Leaf,
    title: 'Natural Ingredients',
    description: 'We use premium, naturally-derived ingredients that nourish without harm.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We never compromise on quality, from products to techniques to service.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building lasting relationships with our clients through trust and care.',
  },
]

export function OurValues() {
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
    <section ref={sectionRef} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4">
            What We Stand For
          </p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight">
            Our <span className="italic">Values</span>
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <div
              key={value.title}
              className={`text-center p-8 border border-border rounded-lg hover:border-primary/50 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <value.icon className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-light mb-4">{value.title}</h3>
              <p className="font-sans text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

