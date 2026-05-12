'use client'

import { useEffect, useRef, useState } from 'react'

export function OurStory() {
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
          {/* Images */}
          <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=1974&auto=format&fit=crop"
                  alt="Beauty clinic interior"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1974&auto=format&fit=crop"
                  alt="Skincare products"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
              <div className="pt-8">
                <img
                  src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop"
                  alt="Beauty treatment"
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4">
              Est. 2010
            </p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8">
              Where Tradition Meets
              <br />
              <span className="italic">Innovation</span>
            </h2>
            <div className="space-y-6 font-sans text-muted-foreground leading-relaxed">
              <p>
                Lumière Beauty Clinic was founded with a simple yet profound vision: to bring the transformative power of Korean skincare to discerning clients who seek nothing but the best for their skin.
              </p>
              <p>
                Our founder, Dr. Soo-yeon Park, trained extensively in Seoul before bringing her expertise to establish Lumière. With over 15 years of experience in advanced aesthetics, she has cultivated a team of specialists who share her passion for excellence.
              </p>
              <p>
                Today, we continue to honor the time-tested traditions of Korean beauty while embracing cutting-edge technology. Every treatment at Lumière is a harmonious blend of ancient wisdom and modern science.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
