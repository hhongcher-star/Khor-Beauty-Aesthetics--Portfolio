import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AboutHero } from '@/components/about/about-hero'
import { OurStory } from '@/components/about/our-story'
import { OurTeam } from '@/components/about/our-team'
import { OurValues } from '@/components/about/our-values'
import { CTASection } from '@/components/home/cta-section'

export const metadata = {
  title: 'About Us | Lumière Beauty Clinic',
  description: 'Learn about Lumière Beauty Clinic - our story, our team, and our commitment to Korean beauty excellence.',
}

export default function AboutPage() {
  return (
    <main>
      <Header />
      <AboutHero />
      <OurStory />
      <OurTeam />
      <OurValues />
      <CTASection />
      <Footer />
    </main>
  )
}
