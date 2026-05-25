import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactHero } from '@/components/contact/contact-hero'
import { ContactContent } from '@/components/contact/contact-content'
export const dynamic = "force-dynamic";

export const metadata = {
  title: 'Contact Us | Khor Beauty Aesthetics',
  description: 'Editable business content: contact Khor Beauty Aesthetics for appointments, treatment enquiries, and Malaysia-based beauty consultations.',
  alternates: { canonical: '/contact' },
  openGraph: {
    url: '/contact',
    title: 'Contact Khor Beauty Aesthetics',
    description:
      'Editable business content: contact Khor Beauty Aesthetics for appointments, enquiries, and treatment information.',
  },
}

export default function ContactPage() {
  return (
    <main>
      <Header />
      <ContactHero />
      <ContactContent />
      <Footer />
    </main>
  )
}

