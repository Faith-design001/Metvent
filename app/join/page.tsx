import type { Metadata } from 'next';
import Link from 'next/link';
import { PAGE_NAMES } from '@/lib/routes';
import { JOIN_CODE_LENGTH, JOIN_CODE_MESSAGES } from '@/lib/join-code';
import { submitJoinCode } from './actions';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: PAGE_NAMES.join,
  description: 'Enter a join code to access your event.',
  robots: {
    index: false,
    follow: false,
  },
};

interface JoinPageProps {
  searchParams: Promise<{
    code?: string;
    error?: string;
    status?: string;
  }>;
}

export default async function JoinPage(props: JoinPageProps) {
  const searchParams = await props.searchParams;
  const initialCode = typeof searchParams.code === 'string' ? searchParams.code : '';
  const errorMessage = typeof searchParams.error === 'string' ? searchParams.error : '';
  const isUnavailable = searchParams.status === 'unavailable';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.wordmark}>
            Metvent
          </Link>
          <nav className={styles.nav} aria-label="Navigation">
            <Link href="/organiser/login" className={styles.navLink}>
              Organiser sign in
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <span className={styles.eyebrow}>Attendee Access</span>
          <h1 className={styles.title}>Enter a join code</h1>
          <p className={styles.subtitle}>
            Enter the 6-character code from the organiser to join the event.
          </p>

          {errorMessage ? (
            <div className={styles.errorBanner} role="alert">
              {errorMessage}
            </div>
          ) : null}

          {isUnavailable ? (
            <div className={styles.statusBanner} role="status">
              {JOIN_CODE_MESSAGES.unavailable}
            </div>
          ) : null}

          <form className={styles.form} action={submitJoinCode}>
            <div className={styles.fieldGroup}>
              <label htmlFor="join-code" className={styles.label}>
                Join code
              </label>
              <input
                id="join-code"
                name="code"
                type="text"
                defaultValue={initialCode}
                maxLength={JOIN_CODE_LENGTH}
                placeholder="e.g. 234XYZ"
                required
                autoComplete="off"
                autoCapitalize="characters"
                autoCorrect="off"
                spellCheck={false}
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.primaryButton}>
              Join event
            </button>
          </form>

          <p className={styles.helperText}>
            No account needed. Your device session stays on this phone.
          </p>

          <div className={styles.divider} role="separator" />

          <p className={styles.footerPrompt}>
            Organising an event?{' '}
            <Link href="/organiser/login" className={styles.footerLink}>
              Organiser sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
