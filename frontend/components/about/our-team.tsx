'use client'

import { useEffect, useRef, useState } from 'react'

const team = [
  {
    name: 'Dr. Soo-yeon Park',
    role: 'Founder & Lead Aesthetician',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop',
    bio: '15+ years of experience in Korean aesthetics',
  },
  {
    name: 'Minhee Kim',
    role: 'Senior Skincare Specialist',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1961&auto=format&fit=crop',
    bio: 'Expert in anti-aging and rejuvenation treatments',
  },
  {
    name: 'Jennifer Lee',
    role: 'Beauty Therapist',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop',
    bio: 'Specializes in hydration and glow treatments',
  },
  {
    name: 'David Chen',
    role: 'Wellness Coordinator',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1974&auto=format&fit=crop',
    bio: 'Ensures every visit is a seamless experience',
  },
]

export function OurTeam() {
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
            Meet The Experts
          </p>
          <h2 className="text-4xl md:text-5xl font-light leading-tight">
            Our <span className="italic">Team</span>
          </h2>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <div
              key={member.name}
              className={`group text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-light mb-1">{member.name}</h3>
              <p className="font-sans text-sm text-primary mb-2">{member.role}</p>
              <p className="font-sans text-sm text-muted-foreground">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

