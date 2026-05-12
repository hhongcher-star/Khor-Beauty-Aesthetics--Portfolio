'use client'

import { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const galleryItems = [
  {
    id: 1,
    treatment: 'Hydra Glow Facial',
    before: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?q=80&w=987&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?q=80&w=987&auto=format&fit=crop',
  },
  {
    id: 2,
    treatment: 'Korean Glass Skin',
    before: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1969&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?q=80&w=987&auto=format&fit=crop',
  },
  {
    id: 3,
    treatment: 'Anti-Aging Treatment',
    before: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1964&auto=format&fit=crop',
    after: 'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?q=80&w=1995&auto=format&fit=crop',
  },
]

export function BeforeAfterGallery() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [sliderPosition, setSliderPosition] = useState(50)
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

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
    setSliderPosition(50)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
    setSliderPosition(50)
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value))
  }

  const currentItem = galleryItems[currentIndex]

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4">
            Real Results
          </p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight">
            Before & <span className="italic">After</span>
          </h2>
        </div>

        {/* Gallery */}
        <div className={`max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Treatment Name */}
          <p className="text-center font-sans text-sm tracking-widest uppercase text-primary mb-8">
            {currentItem.treatment}
          </p>

          {/* Image Comparison */}
          <div className="relative aspect-[16/10] overflow-hidden rounded-lg">
            {/* After Image (Background) */}
            <img
              src={currentItem.after}
              alt={`${currentItem.treatment} - After`}
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Before Image (Clipped) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
              <img
                src={currentItem.before}
                alt={`${currentItem.treatment} - Before`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Slider Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
                <ChevronLeft className="w-4 h-4 text-foreground absolute -left-0.5" />
                <ChevronRight className="w-4 h-4 text-foreground absolute -right-0.5" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-4 left-4 glass px-3 py-1.5 rounded">
              <span className="font-sans text-xs tracking-wider uppercase text-foreground">Before</span>
            </div>
            <div className="absolute bottom-4 right-4 glass px-3 py-1.5 rounded">
              <span className="font-sans text-xs tracking-wider uppercase text-foreground">After</span>
            </div>

            {/* Slider Input (Invisible) */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
              aria-label="Before and after comparison slider"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full border-foreground/30 hover:bg-foreground/5"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {galleryItems.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setSliderPosition(50)
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? 'bg-primary w-6' : 'bg-foreground/30'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full border-foreground/30 hover:bg-foreground/5"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
