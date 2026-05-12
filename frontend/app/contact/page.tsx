import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { ContactHero } from '@/components/contact/contact-hero'
import { ContactContent } from '@/components/contact/contact-content'

export const metadata = {
  title: 'Contact Us | Lumière Beauty Clinic',
  description: 'Get in touch with Lumière Beauty Clinic. Visit us, call us, or send us a message. We are here to help with all your skincare needs.',
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
