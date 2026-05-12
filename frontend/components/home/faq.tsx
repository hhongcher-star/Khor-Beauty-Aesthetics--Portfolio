'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const faqs = [
  {
    question: 'What should I expect during my first visit?',
    answer: 'Your first visit will begin with a comprehensive skin analysis and consultation. Our expert aestheticians will assess your skin type, concerns, and goals to create a personalized treatment plan tailored specifically for you.',
  },
  {
    question: 'How often should I get a facial treatment?',
    answer: 'For optimal results, we recommend facial treatments every 4-6 weeks, which aligns with your skin natural renewal cycle. However, this can vary based on your specific skin concerns and the treatments you choose.',
  },
  {
    question: 'Are the treatments suitable for sensitive skin?',
    answer: 'Absolutely! We specialize in treatments for all skin types, including sensitive skin. Our Korean-inspired approach focuses on gentle yet effective formulations that nourish without irritation.',
  },
  {
    question: 'What is the Korean Glass Skin treatment?',
    answer: 'Our signature Korean Glass Skin treatment is a multi-step facial designed to achieve the coveted dewy, translucent complexion. It includes deep cleansing, exfoliation, essence layering, and intensive hydration to give your skin a luminous, glass-like finish.',
  },
  {
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment through our website booking page, call us directly, or send us a message on WhatsApp. We recommend booking at least 3-5 days in advance to secure your preferred time slot.',
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'We understand that plans can change. We ask for at least 24 hours notice for cancellations or rescheduling. Cancellations with less than 24 hours notice may be subject to a cancellation fee.',
  },
]

export function FAQ() {
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Header */}
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <p className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-4">
              FAQ
            </p>
            <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6">
              Frequently Asked <span className="italic">Questions</span>
            </h2>
            <p className="font-sans text-muted-foreground leading-relaxed">
              Have questions? We have answers. If you cannot find what you are looking for, feel free to contact us directly.
            </p>
          </div>

          {/* Accordion */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-lg px-6 data-[state=open]:bg-secondary/50"
                >
                  <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline py-5">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="font-sans text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
