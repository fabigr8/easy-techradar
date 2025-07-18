import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getRadarData } from '../lib/dataLoader';
import { getDimensionColorClass, getRingColorClass, getRingIndex } from '../lib/colorUtils';
import RadarChart from '../components/RadarChart';
import TechnologyList from '../components/TechnologyList';
import styles from '../styles/Home.module.css';

export default function Home({ radarData }) {
  const [selectedRing, setSelectedRing] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  // Get all unique tags
  const allTags = [...new Set(radarData.technologies.flatMap(tech => tech.tags))].sort();

  // Filter technologies based on selected ring, tags, and status
  const filteredTechnologies = radarData.technologies.filter(tech => {
    const ringMatch = !selectedRing || tech.ring === selectedRing;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => tech.tags.includes(tag));
    
    // Status filter logic
    let statusMatch = true;
    if (selectedStatus === 'new') {
      statusMatch = tech.isNew;
    } else if (selectedStatus === 'changed') {
      statusMatch = tech.hasChanged;
    } else if (selectedStatus === 'unchanged') {
      statusMatch = !tech.isNew && !tech.hasChanged;
    }
    
    return ringMatch && tagMatch && statusMatch;
  });

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <Head>
        <title>{radarData.title} - Version {radarData.version}</title>
        <meta name="description" content={radarData.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          {/* Top bar with logo and navigation */}
          <div className={styles.topBar}>
            <div className={styles.logo}>
              {/* You can replace this with an actual logo image */}
              <div className={styles.logoPlaceholder}>📡</div>
            </div>
            <nav className={styles.nav}>
              <Link href="/overview" className={styles.navLink}>
                <i className="fa fa-list"></i> Technologies Overview
              </Link>
              <Link href="/about" className={styles.navLink}>
                <i className="fa fa-map"></i> How to use this Radar
              </Link>
            </nav>
          </div>
          
          {/* Title and description */}
          <div className={styles.titleSection}>
            <h1 className={styles.headerTitle}>
              {radarData.title}{' '}
              <span className={styles.version}>Version #{radarData.version}</span>
            </h1>
            <p className={styles.description}>{radarData.description}</p>
          </div>
        </header>

        <main>
          {/* Controls */}
          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <h3>Filter by Ring</h3>
              <div className={styles.ringFilters}>
                <button 
                  className={`${styles.ringBtn} ${!selectedRing ? styles.active : ''}`}
                  onClick={() => setSelectedRing(null)}
                >
                  <i className="fa fa-list"></i> All
                </button>
                {radarData.rings.map(ring => (
                  <button
                    key={ring.id}
                    className={`${styles.ringBtn} ${selectedRing === ring.id ? styles.active : ''}`}
                    data-ring-color={getRingIndex(ring.id) + 1}
                    onClick={() => setSelectedRing(ring.id)}
                  >
                    <i className="fa fa-circle"></i> {ring.name}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlGroup}>
              <h3>Filter by Tags</h3>
              <div className={styles.tagFilters}>
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`${styles.tagBtn} ${selectedTags.includes(tag) ? styles.active : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    <i className="fa fa-tag"></i> {tag}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.controlGroup}>
              <h3>Filter by Status</h3>
              <div className={styles.tagFilters}>
                <button 
                  className={`${styles.tagBtn} ${!selectedStatus ? styles.active : ''}`}
                  onClick={() => setSelectedStatus(null)}
                >
                  <i className="fa fa-list"></i> All
                </button>
                <button
                  className={`${styles.tagBtn} ${selectedStatus === 'new' ? styles.active : ''}`}
                  onClick={() => setSelectedStatus('new')}
                >
                  <i className="fa fa-star"></i> New
                </button>
                <button
                  className={`${styles.tagBtn} ${selectedStatus === 'changed' ? styles.active : ''}`}
                  onClick={() => setSelectedStatus('changed')}
                >
                  <i className="fa fa-edit"></i> Changed
                </button>
                <button
                  className={`${styles.tagBtn} ${selectedStatus === 'unchanged' ? styles.active : ''}`}
                  onClick={() => setSelectedStatus('unchanged')}
                >
                  <i className="fa fa-minus"></i> Unchanged
                </button>
              </div>
            </div>
          </div>

          {/* Radar Chart */}
          <RadarChart 
            dimensions={radarData.dimensions}
            technologies={filteredTechnologies}
            selectedRing={selectedRing}
          />

          {/* Legend */}
          <div className={styles.legend}>
            <h3>Rings</h3>
            <div className={styles.legendItems}>
              {radarData.rings.map((ring, index) => (
                <div key={ring.id} className={styles.legendItem}>
                  <div 
                    className={`${styles.legendColor} ${getRingColorClass(index, 'bg')}`}
                  ></div>
                  <div>
                    <strong>{ring.name}</strong>
                    <p>{ring.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technology Lists by Dimension */}
          <div className={styles.dimensionsGrid}>
            {radarData.dimensions.map((dimension, index) => (
              <div key={dimension.id} className={styles.dimensionSection}>
                <h3 className={getDimensionColorClass(index)}>{dimension.name}</h3>
                <p className={styles.dimensionDescription}>{dimension.description}</p>
                <TechnologyList 
                  technologies={filteredTechnologies.filter(tech => 
                    tech.dimension === dimension.id
                  )}
                  dimension={dimension}
                  dimensionIndex={index}
                  rings={radarData.rings}
                />
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const radarData = getRadarData();
  
  return {
    props: {
      radarData
    }
  };
}