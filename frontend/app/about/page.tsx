import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AboutHero } from '@/components/about/about-hero'
import { OurStory } from '@/components/about/our-story'
import { OurTeam } from '@/components/about/our-team'
import { OurValues } from '@/components/about/our-values'
import { CTASection } from '@/components/home/cta-section'
export const dynamic = "force-dynamic";

export const metadata = {
  title: 'About Us | Khor Beauty Aesthetics',
  description: 'Editable business content: learn about Khor Beauty Aesthetics, our story, and our commitment to personalised beauty care in Malaysia.',
  alternates: { canonical: '/about' },
  openGraph: {
    url: '/about',
    title: 'About Khor Beauty Aesthetics',
    description:
      'Editable business content: learn about the people, values, and appointment-led care behind Khor Beauty Aesthetics.',
  },
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

