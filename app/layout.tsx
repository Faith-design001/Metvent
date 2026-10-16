import type { Metadata, Viewport } from 'next';
import '../index.css';
import { fontSans } from '@/lib/fonts';

const siteUrl = process.env.SITE_URL || 'https://metvent.vercel.app';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#5145e5' },
    { media: '(prefers-color-scheme: dark)', color: '#312e81' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Metvent — Keep a conversation going',
    template: '%s | Metvent',
  },
  description:
    'Metvent helps solo attendees keep conversations going at community meetups with real-time room topics and attendee talking points without any guesswork.',
  keywords: [
    'community meetups',
    'event networking',
    'conversation starters',
    'attendee board',
    'meetup conversations',
    'Metvent',
  ],
  authors: [{ name: 'Metvent Team', url: siteUrl }],
  creator: 'Metvent',
  publisher: 'Metvent',
  applicationName: 'Metvent',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  openGraph: {
    title: 'Metvent — Keep a conversation going',
    description:
      'Metvent helps solo attendees keep conversations going at community meetups with real-time room topics and attendee talking points without any guesswork.',
    url: siteUrl,
    siteName: 'Metvent',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Metvent logo and tagline on a purple background: Keep a conversation going. metvent.vercel.app',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metvent — Keep a conversation going',
    description:
      'Metvent helps solo attendees keep conversations going at community meetups with real-time room topics and attendee talking points without any guesswork.',
    images: ['/opengraph-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${siteUrl}/#webapp`,
      name: 'Metvent',
      url: siteUrl,
      description:
        'Metvent helps solo attendees keep conversations going at community meetups with real-time room topics and attendee talking points without any guesswork.',
      applicationCategory: 'SocialNetworkingApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      publisher: {
        '@id': `${siteUrl}/#organization`,
      },
    },
    {
      '@type': 'Organization',
      '@id': `${siteUrl}/#organization`,
      name: 'Metvent',
      url: siteUrl,
      logo: `${siteUrl}/apple-icon.png`,
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ [fontSans.variable]: fontSans.fontFamily, margin: 0 } as React.CSSProperties}>
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
        {children}
      </body>
    </html>
  );
}
