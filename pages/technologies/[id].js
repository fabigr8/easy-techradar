import Head from 'next/head';
import Link from 'next/link';
import { marked } from 'marked';
import { getRadarData, getTechnologyDetails, getRingColor, getDimensionColor } from '../../lib/dataLoader';
import { getDimensionColorClass, getRingColorClass, getRingIndex } from '../../lib/colorUtils';
import RadarChart from '../../components/RadarChart';
import styles from '../../styles/TechnologyDetail.module.css';

export default function TechnologyDetail({ technology, radarData }) {
  if (!technology) {
    return (
      <div className={styles.container}>
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

      <div className={styles.container}>
        <nav className={styles.breadcrumb}>
          <Link href="/">← Back to Radar</Link>
        </nav>

        <header className={styles.techHeader}>
          <div className={styles.techTitleSection}>
            <h1 className={styles.techTitle}>{technology.name}</h1>
            <div className={styles.techMeta}>
              <span 
                className={`${styles.ringBadge} ${getRingColorClass(getRingIndex(ring?.id), 'bg')}`}
              >
                {ring?.name}
              </span>
              {technology.isNew && (
                <span className={`${styles.indicator} ${styles.new}`}>NEW</span>
              )}
              {technology.hasChanged && (
                <span className={`${styles.indicator} ${styles.changed}`}>CHANGED</span>
              )}
            </div>
          </div>
          
          {technology.url && (
            <a 
              href={technology.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              Visit Website →
            </a>
          )}
        </header>

        <div className={styles.contentGrid}>
          <main className={styles.mainContent}>
            <section className={styles.descriptionSection}>
              <h2>Description</h2>
              <p className={styles.description}>{technology.description}</p>
            </section>

            {technology.rationale && (
              <section className={styles.rationaleSection}>
                <h2>Our Assessment</h2>
                <p className={styles.rationale}>{technology.rationale}</p>
              </section>
            )}

            {contentHtml && (
              <section className={styles.detailedContent}>
                <h2>Detailed Analysis</h2>
                <div 
                  className={styles.markdownContent}
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              </section>
            )}

            <section className={styles.tagsSection}>
              <h2>Tags</h2>
              <div className={styles.tags}>
                {technology.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            </section>
          </main>

          <aside className={styles.sidebar}>
            <div className={styles.primaryDimension}>
              <h3>Primary Dimension</h3>
              <div className={styles.dimensionInfo}>
                {(() => {
                  const dimension = radarData.dimensions.find(d => d.id === technology.dimension);
                  return dimension ? (
                    <div className={styles.dimensionCard}>
                      <div 
                        className={`${styles.dimensionBadge} ${getDimensionColorClass(radarData.dimensions.findIndex(d => d.id === dimension.id), 'bg')}`}
                      >
                        {dimension.name}
                      </div>
                      <p className={styles.dimensionDescription}>{dimension.description}</p>
                    </div>
                  ) : (
                    <p>No dimension assigned</p>
                  );
                })()}
              </div>
            </div>

            <div className={styles.radarChartSection}>
              <h3>Technology Profile</h3>
              <RadarChart 
                dimensions={radarData.dimensions}
                technologies={[technology]}
              />
            </div>

            <div className={styles.ringInfo}>
              <h3>About {ring?.name}</h3>
              <p className={styles.ringDescription}>{ring?.description}</p>
            </div>
          </aside>
        </div>
      </div>

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