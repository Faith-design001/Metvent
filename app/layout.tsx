import type { Metadata } from 'next';
import '../index.css';
import { fontSans } from '@/lib/fonts';

const siteUrl = process.env.SITE_URL || 'https://metvent.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ [fontSans.variable]: fontSans.fontFamily, margin: 0 } as React.CSSProperties}>
        {children}
      </body>
    </html>
  );
}

