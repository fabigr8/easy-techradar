import Head from 'next/head';
import Link from 'next/link';
import { marked } from 'marked';
import { getRadarData, getTechnologyDetails, getRingColor, getDimensionColor } from '../../lib/dataLoader';
import RadarChart from '../../components/RadarChart';

export default function TechnologyDetail({ technology, radarData }) {
  if (!technology) {
    return (
      <div className="container">
        <h1>Technology not found</h1>
        <Link href="/">← Back to Radar</Link>
      </div>
    );
  }

  const ring = radarData.rings.find(r => r.id === technology.ring);
  const contentHtml = technology.content ? marked(technology.content) : null;

  return (
    <>
      <Head>
        <title>{technology.name} - Technology Radar</title>
        <meta name="description" content={technology.description} />
      </Head>

      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">← Back to Radar</Link>
        </nav>

        <header className="tech-header">
          <div className="tech-title-section">
            <h1 className="tech-title">{technology.name}</h1>
            <div className="tech-meta">
              <span 
                className="ring-badge"
                style={{ 
                  backgroundColor: ring?.color,
                  color: 'white'
                }}
              >
                {ring?.name}
              </span>
              {technology.isNew && (
                <span className="indicator new">NEW</span>
              )}
              {technology.hasChanged && (
                <span className="indicator changed">CHANGED</span>
              )}
            </div>
          </div>
          
          {technology.url && (
            <a 
              href={technology.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="external-link"
            >
              Visit Website →
            </a>
          )}
        </header>

        <div className="content-grid">
          <main className="main-content">
            <section className="description-section">
              <h2>Description</h2>
              <p className="description">{technology.description}</p>
            </section>

            {technology.rationale && (
              <section className="rationale-section">
                <h2>Our Assessment</h2>
                <p className="rationale">{technology.rationale}</p>
              </section>
            )}

            {contentHtml && (
              <section className="detailed-content">
                <h2>Detailed Analysis</h2>
                <div 
                  className="markdown-content"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </section>
            )}

            <section className="tags-section">
              <h2>Tags</h2>
              <div className="tags">
                {technology.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </section>
          </main>

          <aside className="sidebar">
            <div className="primary-dimension">
              <h3>Primary Dimension</h3>
              <div className="dimension-info">
                {(() => {
                  const dimension = radarData.dimensions.find(d => d.id === technology.dimension);
                  return dimension ? (
                    <div className="dimension-card">
                      <div 
                        className="dimension-badge"
                        style={{ backgroundColor: dimension.color, color: 'white' }}
                      >
                        {dimension.name}
                      </div>
                      <p className="dimension-description">{dimension.description}</p>
                    </div>
                  ) : (
                    <p>No dimension assigned</p>
                  );
                })()}
              </div>
            </div>

            <div className="radar-chart-section">
              <h3>Technology Profile</h3>
              <RadarChart 
                dimensions={radarData.dimensions}
                technologies={[technology]}
              />
            </div>

            <div className="ring-info">
              <h3>About {ring?.name}</h3>
              <p className="ring-description">{ring?.description}</p>
            </div>
          </aside>
        </div>
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
          max-width: 1200px;
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

        .tech-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 2px solid #eee;
        }

        .tech-title-section {
          flex: 1;
        }

        .tech-title {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 1rem;
        }

        .tech-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .ring-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .indicator {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .indicator.new {
          background: #d4edda;
          color: #155724;
        }

        .indicator.changed {
          background: #fff3cd;
          color: #856404;
        }

        .external-link {
          padding: 0.75rem 1.5rem;
          background: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 500;
          transition: background 0.2s;
        }

        .external-link:hover {
          background: #0056b3;
        }

        .content-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 3rem;
        }

        .main-content section {
          margin-bottom: 2rem;
        }

        .main-content h2 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .description, .rationale {
          font-size: 1.1rem;
          line-height: 1.6;
          color: #555;
        }

        .markdown-content {
          line-height: 1.6;
          color: #555;
        }

        .markdown-content h3 {
          color: #333;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .markdown-content p {
          margin-bottom: 1rem;
        }

        .tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tag {
          padding: 0.375rem 0.75rem;
          background: #e9ecef;
          color: #495057;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
        }

        .sidebar {
          background: #f8f9fa;
          padding: 2rem;
          border-radius: 8px;
          height: fit-content;
        }

        .sidebar h3 {
          color: #333;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }

        .sidebar > div {
          margin-bottom: 2rem;
        }

        .sidebar > div:last-child {
          margin-bottom: 0;
        }

        .scores-list {
          space-y: 1rem;
        }

        .primary-dimension {
          margin-bottom: 2rem;
        }

        .dimension-card {
          text-align: center;
        }

        .dimension-badge {
          display: inline-block;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .dimension-description {
          color: #666;
          font-size: 0.9rem;
          line-height: 1.4;
          margin: 0;
        }

        .spider-chart-section {
          height: 400px;
        }

        .radar-chart-section {
          height: 400px;
        }

        .ring-description {
          color: #666;
          line-height: 1.5;
          font-size: 0.95rem;
        }

        @media (max-width: 968px) {
          .content-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .tech-header {
            flex-direction: column;
            gap: 1rem;
          }

          .tech-title {
            font-size: 2rem;
          }

          .container {
            padding: 1rem;
          }
        }
      `}</style>
    </>
  );
}

export async function getStaticPaths() {
  const radarData = getRadarData();
  const paths = radarData.technologies.map(tech => ({
    params: { id: tech.id }
  }));

  return {
    paths,
    fallback: false
  };
}

export async function getStaticProps({ params }) {
  const radarData = getRadarData();
  const technology = getTechnologyDetails(params.id);

  return {
    props: {
      technology,
      radarData
    }
  };
}