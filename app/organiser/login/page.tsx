import Link from 'next/link';
import styles from './page.module.css';

export default function OrganiserLoginPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link href="/" className={styles.wordmark}>
            Metvent
          </Link>
          <nav className={styles.nav} aria-label="Navigation">
            <Link href="/join" className={styles.navLink}>
              Join with a code
            </Link>
          </nav>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <span className={styles.eyebrow}>Organiser Access</span>
          <h1 className={styles.title}>Organiser Sign In</h1>
          <p className={styles.subtitle}>
            Sign in with your email address to manage your events.
          </p>

          <form className={styles.form} action="#" method="post">
            <div className={styles.fieldGroup}>
              <label htmlFor="organiser-email" className={styles.label}>
                Email address
              </label>
              <input
                id="organiser-email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                autoComplete="email"
                autoCapitalize="none"
                className={styles.input}
              />
            </div>

            <button type="submit" className={styles.primaryButton}>
              Send magic link
            </button>
          </form>

          <p className={styles.helperText}>
            We will email you a secure, single-use link that signs you in without a password.
          </p>

          <div className={styles.divider} role="separator" />

          <p className={styles.footerPrompt}>
            Attending an event?{' '}
            <Link href="/join" className={styles.footerLink}>
              Join with a code
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
