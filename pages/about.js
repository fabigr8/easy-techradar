import Head from 'next/head';
import Link from 'next/link';
import styles from '../styles/About.module.css';

export default function About() {
  return (
    <>
      <Head>
        <title>About - Technology Radar</title>
        <meta name="description" content="Learn how to use and interpret our Technology Radar" />
      </Head>

      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">← Back to Radar</Link>
        </nav>

        <header className={styles.header}>
          <h1>How to use the Technology Radar</h1>
          <p>Understanding our assessment methodology and what each ring means.</p>
        </header>

        <main className={styles.content}>
          <section>
            <h2>What is the Technology Radar?</h2>
            <p>
              The Technology Radar is a tool to inspire and support teams to pick the best 
              technologies for new projects. It provides a platform to share knowledge and 
              experience about the adoption of technologies through the generations.
            </p>
          </section>

          <section>
            <h2>The Rings</h2>
            <div className={styles.ringsExplanation}>
              <div className={styles.ringItem}>
                <div className={styles.ringHeader}>
                  <div className={`${styles.ringColor} ${styles.adopt}`}></div>
                  <h3>Adopt</h3>
                </div>
                <p>
                  Technologies we think you should seriously consider using. We have used 
                  them for longer periods in many teams and they have proven to be stable 
                  and useful.
                </p>
              </div>

              <div className={styles.ringItem}>
                <div className={styles.ringHeader}>
                  <div className={`${styles.ringColor} ${styles.trial}`}></div>
                  <h3>Trial</h3>
                </div>
                <p>
                  Technologies that are ready for use, but not as completely proven as those 
                  in the Adopt ring. Use with some caution and expect some issues.
                </p>
              </div>

              <div className={styles.ringItem}>
                <div className={styles.ringHeader}>
                  <div className={`${styles.ringColor} ${styles.assess}`}></div>
                  <h3>Assess</h3>
                </div>
                <p>
                  Technologies to look at closely, but not necessarily trial yet — unless 
                  you think they would be a particularly good fit for you.
                </p>
              </div>

              <div className={styles.ringItem}>
                <div className={styles.ringHeader}>
                  <div className={`${styles.ringColor} ${styles.hold}`}></div>
                  <h3>Hold</h3>
                </div>
                <p>
                  Proceed with caution. While not necessarily bad, these technologies have 
                  issues that make them unsuitable for most situations.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>The Dimensions</h2>
            <p>
              Our radar is organized into dimensions that represent different aspects of 
              technology adoption. Each technology belongs to one primary dimension:
            </p>
            <ul className={styles.dimensionsList}>
              <li>
                <strong>Languages & Frameworks:</strong> Programming languages and essential 
                frameworks for building custom software.
              </li>
              <li>
                <strong>Tools:</strong> Software tools from simple productivity enhancers to 
                comprehensive project solutions.
              </li>
              <li>
                <strong>Platforms & Operations:</strong> Technologies for software and 
                infrastructure operations, including platforms and services.
              </li>
              <li>
                <strong>Methods & Patterns:</strong> Software development methods and design 
                patterns, from CI/CD to architecture patterns.
              </li>
            </ul>
          </section>

          <section>
            <h2>Status Indicators</h2>
            <div className={styles.statusIndicators}>
              <div className={styles.statusItem}>
                <span className={`${styles.indicator} ${styles.new}`}>NEW</span>
                <span>New in this version of the radar</span>
              </div>
              <div className={styles.statusItem}>
                <span className={`${styles.indicator} ${styles.changed}`}>CHANGED</span>
                <span>Recently moved to a different ring</span>
              </div>
              <div className={styles.statusItem}>
                <span className={`${styles.indicator} ${styles.unchanged}`}>UNCHANGED</span>
                <span>No change since last version</span>
              </div>
            </div>
          </section>

          <section>
            <h2>How to Navigate</h2>
            <ul>
              <li>
                <strong>Main Radar View:</strong> Use the radar chart to visualize technology 
                positioning across dimensions. Filter by rings or tags to focus on specific areas.
              </li>
              <li>
                <strong>Technology Details:</strong> Click on any technology to see detailed 
                information, rationale, and its primary dimension.
              </li>
              <li>
                <strong>Overview Table:</strong> Use the overview page for a comprehensive 
                table view with sorting and filtering capabilities.
              </li>
            </ul>
          </section>

          <section>
            <h2>Contributing</h2>
            <p>
              This radar reflects our current thinking and experiences. Technology assessments 
              are updated regularly based on:
            </p>
            <ul>
              <li>Project experiences and outcomes</li>
              <li>Community feedback and adoption</li>
              <li>Technology maturity and stability</li>
              <li>Team expertise and learning</li>
            </ul>
          </section>
        </main>
      </div>
    </>
  );
}