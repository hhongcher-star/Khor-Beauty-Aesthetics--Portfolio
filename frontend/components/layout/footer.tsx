import Link from 'next/link'
import { Instagram, Facebook, MessageCircle } from 'lucide-react'

const footerLinks = {
  services: [
    { href: '/services#facials', label: 'Facials' },
    { href: '/services#treatments', label: 'Skin Treatments' },
    { href: '/services#body', label: 'Body Contouring' },
    { href: '/services#anti-aging', label: 'Anti-Aging' },
  ],
  company: [
    { href: '/about', label: 'About Us' },
    { href: '/contact', label: 'Contact' },
    { href: '/booking', label: 'Book Appointment' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-light tracking-[0.2em]">LUMIÃˆRE</span>
            </Link>
            <p className="mt-6 text-background/70 font-sans text-sm leading-relaxed">
              Experience the art of Korean beauty. Premium skincare treatments and personalized care in a serene environment.
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-background/30 flex items-center justify-center hover:bg-background/10 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-background/30 flex items-center justify-center hover:bg-background/10 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-background/30 flex items-center justify-center hover:bg-background/10 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-sans tracking-widest uppercase mb-6">Services</h4>
            <ul className="space-y-4">
              {footerLinks.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-background font-sans text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-sans tracking-widest uppercase mb-6">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-background/70 hover:text-background font-sans text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-sans tracking-widest uppercase mb-6">Contact</h4>
            <div className="space-y-4 text-background/70 font-sans text-sm">
              <p>123 Beauty Lane, Suite 100</p>
              <p>Seoul, South Korea</p>
              <p className="pt-2">
                <a href="tel:+821012345678" className="hover:text-background transition-colors">
                  +82 10 1234 5678
                </a>
              </p>
              <p>
                <a href="mailto:hello@lumiere.com" className="hover:text-background transition-colors">
                  hello@lumiere.com
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/50 font-sans text-xs">
            &copy; {new Date().getFullYear()} LumiÃ¨re Beauty Clinic. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-background/50 hover:text-background font-sans text-xs transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-background/50 hover:text-background font-sans text-xs transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

