import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Hero } from '@/components/home/hero'
import { Introduction } from '@/components/home/introduction'
import { FeaturedTreatments } from '@/components/home/featured-treatments'
import { BeforeAfterGallery } from '@/components/home/before-after-gallery'
import { Testimonials } from '@/components/home/testimonials'
import { FAQ } from '@/components/home/faq'
import { CTASection } from '@/components/home/cta-section'

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Introduction />
      <FeaturedTreatments />
      <BeforeAfterGallery />
      <Testimonials />
      <FAQ />
      <CTASection />
      <Footer />
    </main>
  )
}
