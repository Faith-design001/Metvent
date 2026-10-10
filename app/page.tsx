import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.css';

const siteUrl = process.env.SITE_URL;

export const metadata: Metadata = {
  description: 'Keep a conversation going',
  openGraph: {
    title: 'Metvent',
    description: 'Keep a conversation going',
    type: 'website',
    ...(siteUrl ? { url: siteUrl } : {}),
  },
  twitter: {
    card: 'summary',
    title: 'Metvent',
    description: 'Keep a conversation going',
  },
  robots: {
    index: true,
    follow: true,
  },
  ...(siteUrl ? { alternates: { canonical: siteUrl } } : {}),
};

export default function HomePage() {
  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Metvent</h1>
      <p className={styles.description}>
        It shows what is happening in the room right now, and which attendees have said what they want to talk about tonight.
      </p>
      <Link href="/join" className={styles.link}>
        enter a join code
      </Link>
    </main>
  );
}
