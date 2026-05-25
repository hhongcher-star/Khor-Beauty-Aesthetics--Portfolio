import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LocalBusinessSchema } from '@/components/seo/local-business-schema'
import { siteConfig } from '@/lib/site'
import './globals.css'

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'Khor Beauty Aesthetics | Premium Beauty Treatments in Malaysia',
    template: '%s | Khor Beauty Aesthetics',
  },
  description: 'Editable business content: Khor Beauty Aesthetics offers premium facial, skin booster, brightening, and wellness-focused aesthetic treatments in Malaysia.',
  keywords: ['Khor Beauty', 'beauty clinic Malaysia', 'aesthetic treatments', 'facial treatment', 'skin care Malaysia'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_MY',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'Khor Beauty Aesthetics | Premium Beauty Treatments in Malaysia',
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: 'Khor Beauty Aesthetics premium treatment room and skincare experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khor Beauty Aesthetics',
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${cormorant.variable} ${inter.variable} font-serif antialiased`}>
        <LocalBusinessSchema />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

