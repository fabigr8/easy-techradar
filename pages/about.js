import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About - Technology Radar</title>
        <meta name="description" content="Learn how to use and interpret our Technology Radar" />
      </Head>

      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">← Back to Radar</Link>
        </nav>

        <header>
          <h1>How to use the Technology Radar</h1>
          <p>Understanding our assessment methodology and what each ring means.</p>
        </header>

        <main className="content">
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
            <div className="rings-explanation">
              <div className="ring-item">
                <div className="ring-header">
                  <div className="ring-color adopt"></div>
                  <h3>Adopt</h3>
                </div>
                <p>
                  Technologies we think you should seriously consider using. We have used 
                  them for longer periods in many teams and they have proven to be stable 
                  and useful.
                </p>
              </div>

              <div className="ring-item">
                <div className="ring-header">
                  <div className="ring-color trial"></div>
                  <h3>Trial</h3>
                </div>
                <p>
                  Technologies that are ready for use, but not as completely proven as those 
                  in the Adopt ring. Use with some caution and expect some issues.
                </p>
              </div>

              <div className="ring-item">
                <div className="ring-header">
                  <div className="ring-color assess"></div>
                  <h3>Assess</h3>
                </div>
                <p>
                  Technologies to look at closely, but not necessarily trial yet — unless 
                  you think they would be a particularly good fit for you.
                </p>
              </div>

              <div className="ring-item">
                <div className="ring-header">
                  <div className="ring-color hold"></div>
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
            <ul className="dimensions-list">
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
            <div className="status-indicators">
              <div className="status-item">
                <span className="indicator new">NEW</span>
                <span>New in this version of the radar</span>
              </div>
              <div className="status-item">
                <span className="indicator changed">CHANGED</span>
                <span>Recently moved to a different ring</span>
              </div>
              <div className="status-item">
                <span className="indicator unchanged">UNCHANGED</span>
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

      <style jsx global>{`
        body {
          background: #0A0A0E;
          margin: 0;
          padding: 0;
        }
      `}</style>
      <style jsx>{`
        .container {
          max-width: 900px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .breadcrumb {
          margin-bottom: 2rem;
        }

        .breadcrumb a {
          color: #666;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .breadcrumb a:hover {
          color: #333;
        }

        header {
          margin-bottom: 3rem;
          text-align: center;
        }

        header h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        header p {
          font-size: 1.2rem;
          color: #666;
        }

        .content section {
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #eee;
        }

        .content section:last-child {
          border-bottom: none;
        }

        h2 {
          color: #333;
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        h3 {
          color: #333;
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        p {
          line-height: 1.6;
          color: #555;
          margin-bottom: 1rem;
        }

        ul {
          line-height: 1.6;
          color: #555;
        }

        .rings-explanation {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .ring-item {
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid var(--ring-color);
        }

        .ring-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .ring-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
        }

        .ring-color.adopt {
          background: #588157;
        }

        .ring-color.trial {
          background: #457b9d;
        }

        .ring-color.assess {
          background: #bc6c25;
        }

        .ring-color.hold {
          background: #d62828;
        }

        .ring-item {
          --ring-color: #588157;
        }

        .ring-item:nth-child(1) {
          --ring-color: #588157;
        }

        .ring-item:nth-child(2) {
          --ring-color: #457b9d;
        }

        .ring-item:nth-child(3) {
          --ring-color: #bc6c25;
        }

        .ring-item:nth-child(4) {
          --ring-color: #d62828;
        }

        .dimensions-list {
          margin-top: 1rem;
        }

        .dimensions-list li {
          margin-bottom: 1rem;
        }

        .status-indicators {
          margin-top: 1.5rem;
        }

        .status-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .indicator {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          white-space: nowrap;
        }

        .indicator.new {
          background: #d4edda;
          color: #155724;
        }

        .indicator.changed {
          background: #fff3cd;
          color: #856404;
        }

        .indicator.unchanged {
          background: #f8f9fa;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          header h1 {
            font-size: 2rem;
          }

          .rings-explanation {
            grid-template-columns: 1fr;
          }

          .status-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </>
  );
}