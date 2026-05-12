'use client'

import { useEffect, useRef, useState } from 'react'

export function Introduction() {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="aspect-[4/5] relative">
              <img
                src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop"
                alt="Luxury beauty treatment"
                className="w-full h-full object-cover"
              />
              {/* Decorative Frame */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border border-primary/30 -z-10" />
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4">
              Our Philosophy
            </p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8">
              Where Science Meets
              <br />
              <span className="italic">Timeless Beauty</span>
            </h2>
            <div className="space-y-6 font-sans text-muted-foreground leading-relaxed">
              <p>
                At KHOR, we believe that true beauty comes from within. Our approach combines centuries-old Korean skincare wisdom with cutting-edge technology to deliver transformative results.
              </p>
              <p>
                Each treatment is meticulously crafted and personalized to your unique skin needs, ensuring that you receive the care and attention you deserve.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-border">
              <div>
                <p className="text-4xl font-light text-primary">15+</p>
                <p className="font-sans text-sm text-muted-foreground mt-2">Years Experience</p>
              </div>
              <div>
                <p className="text-4xl font-light text-primary">10K+</p>
                <p className="font-sans text-sm text-muted-foreground mt-2">Happy Clients</p>
              </div>
              <div>
                <p className="text-4xl font-light text-primary">50+</p>
                <p className="font-sans text-sm text-muted-foreground mt-2">Treatments</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

