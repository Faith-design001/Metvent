import type { Metadata, Viewport } from 'next';
import '../index.css';
import { fontSans } from '@/lib/fonts';
import { themeColor } from '@/lib/tokens';

const siteUrl = process.env.SITE_URL;

export const viewport: Viewport = {
  themeColor,
};

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: {
    default: 'Metvent',
    template: '%s | Metvent',
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
