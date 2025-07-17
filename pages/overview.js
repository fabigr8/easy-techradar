import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getRadarData } from '../lib/dataLoader';
import { getDimensionColorClass, getRingColorClass, getRingIndex } from '../lib/colorUtils';
import styles from '../styles/Overview.module.css';

export default function Overview({ radarData }) {
  const [sortBy, setSortBy] = useState('name');
  const [filterRing, setFilterRing] = useState('');
  const [filterDimension, setFilterDimension] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter and sort technologies
  const filteredTechnologies = radarData.technologies
    .filter(tech => {
      const matchesSearch = tech.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tech.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesRing = !filterRing || tech.ring === filterRing;
      const matchesDimension = !filterDimension || tech.dimension === filterDimension;
      
      return matchesSearch && matchesRing && matchesDimension;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'ring':
          const ringOrder = { adopt: 0, trial: 1, assess: 2, hold: 3 };
          return ringOrder[a.ring] - ringOrder[b.ring];
        case 'newest':
          return b.isNew - a.isNew;
        case 'changed':
          return b.hasChanged - a.hasChanged;
        default:
          return a.name.localeCompare(b.name);
      }
    });

  const getRingInfo = (ringId) => radarData.rings.find(r => r.id === ringId);
  const getDimensionInfo = (dimId) => radarData.dimensions.find(d => d.id === dimId);

  return (
    <>
      <Head>
        <title>Technologies Overview - Technology Radar</title>
        <meta name="description" content="Complete overview of all technologies in our radar" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <nav className={styles.breadcrumb}>
            <Link href="/"><i className="fa fa-arrow-left"></i> Back to Radar</Link>
          </nav>
          
          <h1>Technologies Overview</h1>
          <p>Complete list of all technologies in our radar with detailed information.</p>
        </header>

        {/* Filters and Search */}
        <div className={styles.controls}>
          <div className={styles.searchSection}>
            <div className={styles.searchInputContainer}>
              <i className="fa fa-search"></i>
              <input
                type="text"
                placeholder="Search technologies or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="ring">Ring</option>
                <option value="newest">New First</option>
                <option value="changed">Changed First</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Filter by Ring:</label>
              <select value={filterRing} onChange={(e) => setFilterRing(e.target.value)}>
                <option value="">All Rings</option>
                {radarData.rings.map(ring => (
                  <option key={ring.id} value={ring.id}>{ring.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Filter by Dimension:</label>
              <select value={filterDimension} onChange={(e) => setFilterDimension(e.target.value)}>
                <option value="">All Dimensions</option>
                {radarData.dimensions.map(dim => (
                  <option key={dim.id} value={dim.id}>{dim.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className={styles.resultsSummary}>
          <p>Showing {filteredTechnologies.length} of {radarData.technologies.length} technologies</p>
        </div>

        {/* Technologies Table */}
        <div className={styles.tableContainer}>
          <table className={styles.technologiesTable}>
            <thead>
              <tr>
                <th>Technology</th>
                <th>Ring</th>
                <th>Dimensions</th>
                <th>Tags</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTechnologies.map(tech => {
                const ring = getRingInfo(tech.ring);
                const dimension = getDimensionInfo(tech.dimension);

                return (
                  <tr key={tech.id} className={styles.techRow}>
                    <td className={styles.techNameCell}>
                      <div className={styles.techNameContainer}>
                        <strong className={styles.techName}>{tech.name}</strong>
                        <p className={styles.techDescription}>{tech.description}</p>
                      </div>
                    </td>
                    
                    <td className={styles.ringCell}>
                      <span 
                        className={`${styles.ringBadge} ${getRingColorClass(getRingIndex(ring?.id), 'bg')}`}
                      >
                        {ring?.name}
                      </span>
                    </td>
                    
                    <td className={styles.dimensionsCell}>
                      <div className={styles.dimensionScore}>
                        <span 
                          className={`${styles.dimensionBadge} ${getDimensionColorClass(radarData.dimensions.findIndex(d => d.id === dimension?.id), 'bg')}`}
                        >
                          {dimension?.name}
                        </span>
                      </div>
                    </td>
                    
                    <td className={styles.tagsCell}>
                      <div className={styles.tagsContainer}>
                        {tech.tags.slice(0, 3).map(tag => (
                          <span key={tag} className={styles.tag}>
                            <i className="fa fa-tag"></i> {tag}
                          </span>
                        ))}
                        {tech.tags.length > 3 && (
                          <span className={`${styles.tag} ${styles.overflow}`}>
                            <i className="fa fa-plus"></i>{tech.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className={styles.statusCell}>
                      <div className={styles.statusIndicators}>
                        {tech.isNew && (
                          <span className={`${styles.indicator} ${styles.new}`}>NEW</span>
                        )}
                        {tech.hasChanged && (
                          <span className={`${styles.indicator} ${styles.changed}`}>CHANGED</span>
                        )}
                        {!tech.isNew && !tech.hasChanged && (
                          <span className={`${styles.indicator} ${styles.unchanged}`}>UNCHANGED</span>
                        )}
                      </div>
                    </td>
                    
                    <td className={styles.actionsCell}>
                      <div className={styles.actions}>
                        <Link 
                          href={`/technologies/${tech.id}`}
                          className={`${styles.actionBtn} ${styles.viewBtn}`}
                        >
                          <i className="fa fa-eye"></i> View Details
                        </Link>
                        {tech.url && (
                          <a 
                            href={tech.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`${styles.actionBtn} ${styles.externalBtn}`}
                          >
                            <i className="fa fa-external-link"></i> Website
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredTechnologies.length === 0 && (
          <div className={styles.noResults}>
            <p>No technologies found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterRing('');
                setFilterDimension('');
              }}
              className={styles.resetBtn}
            >
              <i className="fa fa-refresh"></i> Clear Filters
            </button>
          </div>
        )}
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