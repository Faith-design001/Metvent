import type { Metadata } from 'next';
import '../index.css';
import { fontSans } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Metvent',
  description: 'Metvent shows room activity and attendee conversation topics at community meetups.',
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
