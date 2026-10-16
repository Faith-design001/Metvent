import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <span className={styles.wordmark}>Metvent</span>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero} aria-labelledby="hero-title">
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>Metvent for Community Meetups</span>
            <h1 id="hero-title" className={styles.heroTitle}>Metvent</h1>
            <p className={styles.heroSubtitle}>Keep a conversation going.</p>
            <p className={styles.heroDescription}>
              Metvent shows what is happening in the room right now and what attendees have said they want to talk about tonight. It turns real event data into something specific you can actually say, without guessing anything about another person.
            </p>
            <div className={styles.actionGroup}>
              <Link href="/join" className={styles.primaryButton}>
                Join with a code
              </Link>
              <Link href="/organiser/login" className={styles.secondaryButton}>
                Organiser sign in
              </Link>
            </div>
          </div>
        </section>

        {/* The Problem Section */}
        <section className={styles.section} aria-labelledby="problem-heading">
          <div className={styles.sectionInner}>
            <span className={styles.eyebrow}>The Problem</span>
            <h2 id="problem-heading" className={styles.sectionHeading}>
              Why conversations die after ninety seconds
            </h2>
            <div className={styles.problemCard}>
              <p className={styles.bodyParagraph}>
                A talk ends. The room breaks into circles. People stand holding cups, looking at phones. Most people can only think of one opener: &apos;So, what do you do?&apos; Both people have used it once tonight and watched it die.
              </p>
              <p className={styles.bodyParagraph}>
                The primary problem is continuing a conversation once it has started. Small talk stalls when you run out of true things to say. Metvent gives you real, specific facts about the other person and the room when you need them.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className={styles.section} aria-labelledby="how-it-works-heading">
          <div className={styles.sectionInner}>
            <span className={styles.eyebrow}>How It Works</span>
            <h2 id="how-it-works-heading" className={styles.sectionHeading}>
              Five focused tools built on real event data
            </h2>
            <div className={styles.featuresGrid}>
              <article className={styles.featureCard}>
                <span className={styles.featureNumber}>01</span>
                <h3 className={styles.featureTitle}>The Board</h3>
                <p className={styles.featureCopy}>
                  See who else is in the room and what they want to talk about tonight. Cards show one line on what an attendee does, one line on their topic, and up to three event tags. You only see others when you make your own card visible.
                </p>
              </article>

              <article className={styles.featureCard}>
                <span className={styles.featureNumber}>02</span>
                <h3 className={styles.featureTitle}>The Opener</h3>
                <p className={styles.featureCopy}>
                  Get a specific, truthful way to start talking to a chosen person. Sentences draw strictly from real card lines or active room context. Every sentence displays the exact source field it came from.
                </p>
              </article>

              <article className={styles.featureCard}>
                <span className={styles.featureNumber}>03</span>
                <h3 className={styles.featureTitle}>The Second Question</h3>
                <p className={styles.featureCopy}>
                  Step away for a quick break and find a deeper question keyed to the person&apos;s stated topic. Templates help you keep the conversation going, and include one polite line to exit gracefully.
                </p>
              </article>

              <article className={styles.featureCard}>
                <span className={styles.featureNumber}>04</span>
                <h3 className={styles.featureTitle}>Room Right Now</h3>
                <p className={styles.featureCopy}>
                  See the current session, the speaker, the topic, and the next break time. It provides a relevant question about the talk, updated live from the organiser schedule.
                </p>
              </article>

              <article className={styles.featureCard}>
                <span className={styles.featureNumber}>05</span>
                <h3 className={styles.featureTitle}>Who I Met</h3>
                <p className={styles.featureCopy}>
                  Save private notes on your phone about who you met and what to talk about next time. Notes belong only to you, stored on your device session, and are never shared or indexed.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* For Organisers Section */}
        <section className={styles.section} aria-labelledby="organisers-heading">
          <div className={styles.sectionInner}>
            <span className={styles.eyebrow}>For Organisers</span>
            <h2 id="organisers-heading" className={styles.sectionHeading}>
              Set up an event in eight minutes
            </h2>
            <div className={styles.organisersCard}>
              <p className={styles.bodyParagraph}>
                Community meetups succeed when attendees make real connections. Organisers enter the event name, date, description, and optional topics in fewer than eight fields.
              </p>
              <p className={styles.bodyParagraph}>
                Project a short join code on screen so attendees join with no account setup. Enter sessions, update schedules with a single toggle, and close the event with one tap when doors shut.
              </p>
              <p className={styles.bodyParagraphEmphasis}>
                Version one is free for attendees and organisers. There are no fees and no payment flows.
              </p>
            </div>
          </div>
        </section>

        {/* Privacy Promise Section */}
        <section className={styles.section} aria-labelledby="privacy-heading">
          <div className={styles.sectionInner}>
            <span className={styles.eyebrow}>Privacy Promise</span>
            <h2 id="privacy-heading" className={styles.sectionHeading}>
              Real data, strict boundaries
            </h2>
            <div className={styles.privacyGrid}>
              <div className={styles.privacyItem}>
                <h3 className={styles.privacyItemTitle}>Visibility off by default</h3>
                <p className={styles.privacyItemCopy}>
                  You choose when to make your card visible. Turning visibility off removes your card on the very next request.
                </p>
              </div>

              <div className={styles.privacyItem}>
                <h3 className={styles.privacyItemTitle}>No accounts or passwords</h3>
                <p className={styles.privacyItemCopy}>
                  Attendees join with a code. We never collect an email address, phone number, or password from attendees.
                </p>
              </div>

              <div className={styles.privacyItem}>
                <h3 className={styles.privacyItemTitle}>Private notes stay private</h3>
                <p className={styles.privacyItemCopy}>
                  Notes you take belong only to your device session. No other attendee or organiser can read them.
                </p>
              </div>

              <div className={styles.privacyItem}>
                <h3 className={styles.privacyItemTitle}>No matching or ranking</h3>
                <p className={styles.privacyItemCopy}>
                  The product never calculates compatibility, never ranks attendees, and never messages on your behalf.
                </p>
              </div>

              <div className={styles.privacyItem}>
                <h3 className={styles.privacyItemTitle}>Thirty-day deletion</h3>
                <p className={styles.privacyItemCopy}>
                  Attendee cards and flags are deleted thirty days after the event closes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Closing Call to Action Section */}
        <section className={styles.ctaSection} aria-labelledby="cta-heading">
          <div className={styles.ctaCard}>
            <h2 id="cta-heading" className={styles.ctaHeading}>Ready for your next event?</h2>
            <p className={styles.ctaSubtitle}>Keep conversations going with real event data.</p>
            <div className={styles.actionGroup}>
              <Link href="/join" className={styles.primaryButton}>
                Join with a code
              </Link>
              <Link href="/organiser/login" className={styles.secondaryButton}>
                Organiser sign in
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerBrand}>
            <span className={styles.footerWordmark}>Metvent</span>
            <p className={styles.footerDescription}>
              A web page opened at community meetups to keep conversations going.
            </p>
          </div>
          <nav className={styles.footerNav} aria-label="Footer navigation">
            <Link href="/join" className={styles.footerLink}>
              Join an Event
            </Link>
            <Link href="/organiser/login" className={styles.footerLink}>
              Organiser Portal
            </Link>
          </nav>
          <div className={styles.footerNotice}>
            <p className={styles.footerNoticeText}>
              Version one is free for attendees and organisers. Cards remain scoped to a single event.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
