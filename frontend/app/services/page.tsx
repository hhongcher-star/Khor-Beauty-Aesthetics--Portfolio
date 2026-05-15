import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ServicesHero } from '@/components/services/services-hero'
import { ServiceCategories } from '@/components/services/service-categories'
import { AllServices } from '@/components/services/all-services'
import { CTASection } from '@/components/home/cta-section'
import { apiRequest } from '@/lib/api'
export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Our Services | Lumière Beauty Clinic',
  description:
    'Explore our comprehensive range of luxury skincare treatments including facials, anti-aging, body contouring, and more.',
}

export default async function ServicesPage() {
  const response = await apiRequest('/services')
  const services = Array.isArray(response) ? response : []

  return (
    <main>
      <Header />
      <ServicesHero />
      <ServiceCategories services={services} />
      <AllServices services={services} />
      <CTASection />
      <Footer />
    </main>
  )
}