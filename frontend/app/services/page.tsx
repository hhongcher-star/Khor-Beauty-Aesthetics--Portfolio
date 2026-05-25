import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ServicesHero } from '@/components/services/services-hero'
import { ServiceCategories } from '@/components/services/service-categories'
import { AllServices } from '@/components/services/all-services'
import { CTASection } from '@/components/home/cta-section'
import { apiRequest } from '@/lib/api'
export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Our Services | Khor Beauty Aesthetics',
  description:
    'Editable business content: explore Khor Beauty services including facials, skin boosters, brightening care, hydration treatments, and body care.',
  alternates: { canonical: '/services' },
  openGraph: {
    url: '/services',
    title: 'Beauty Services by Khor Beauty Aesthetics',
    description:
      'Editable business content: explore facials, skin boosters, brightening care, hydration treatments, and body care.',
  },
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
