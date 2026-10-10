import Link from 'next/link';
import styles from './page.module.css';

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
