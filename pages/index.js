import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getRadarData } from '../lib/dataLoader';
import RadarChart from '../components/RadarChart';
import TechnologyList from '../components/TechnologyList';

export default function Home({ radarData }) {
  const [selectedRing, setSelectedRing] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  // Get all unique tags
  const allTags = [...new Set(radarData.technologies.flatMap(tech => tech.tags))].sort();

  // Filter technologies based on selected ring and tags
  const filteredTechnologies = radarData.technologies.filter(tech => {
    const ringMatch = !selectedRing || tech.ring === selectedRing;
    const tagMatch = selectedTags.length === 0 || selectedTags.some(tag => tech.tags.includes(tag));
    return ringMatch && tagMatch;
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
      </Head>

      <div className="container">
        <header className="header">
          <h1>
            {radarData.title}{' '}
            <span className="version">Version #{radarData.version}</span>
          </h1>
          <p className="description">{radarData.description}</p>
          
          <nav className="nav">
            <Link href="/overview" className="nav-link">
              📊 Technologies Overview
            </Link>
            <Link href="/about" className="nav-link">
              ❓ How to use this Radar
            </Link>
          </nav>
        </header>

        <main>
          {/* Controls */}
          <div className="controls">
            <div className="control-group">
              <h3>Filter by Ring</h3>
              <div className="ring-filters">
                <button 
                  className={`ring-btn ${!selectedRing ? 'active' : ''}`}
                  onClick={() => setSelectedRing(null)}
                >
                  All
                </button>
                {radarData.rings.map(ring => (
                  <button
                    key={ring.id}
                    className={`ring-btn ${selectedRing === ring.id ? 'active' : ''}`}
                    style={{ '--ring-color': ring.color }}
                    onClick={() => setSelectedRing(ring.id)}
                  >
                    {ring.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <h3>Filter by Tags</h3>
              <div className="tag-filters">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    className={`tag-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </button>
                ))}
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
          <div className="legend">
            <h3>Rings</h3>
            <div className="legend-items">
              {radarData.rings.map(ring => (
                <div key={ring.id} className="legend-item">
                  <div 
                    className="legend-color"
                    style={{ backgroundColor: ring.color }}
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
          <div className="dimensions-grid">
            {radarData.dimensions.map(dimension => (
              <div key={dimension.id} className="dimension-section">
                <h3 style={{ color: dimension.color }}>{dimension.name}</h3>
                <p className="dimension-description">{dimension.description}</p>
                <TechnologyList 
                  technologies={filteredTechnologies.filter(tech => 
                    tech.dimension === dimension.id
                  )}
                  dimension={dimension}
                  rings={radarData.rings}
                />
              </div>
            ))}
          </div>
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
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background: #0A0A0E;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #FFF;
          margin-bottom: 0.5rem;
        }

        .version {
          color: #32B569;
          font-weight: normal;
        }

        .description {
          font-size: 1.2rem;
          color: #CCC;
          margin-bottom: 2rem;
        }

        .nav {
          display: flex;
          gap: 1rem;
          justify-content: center;
        }

        .nav-link {
          padding: 0.5rem 1rem;
          background: #373847;
          border-radius: 6px;
          text-decoration: none;
          color: #FFF;
          transition: background 0.2s;
        }

        .nav-link:hover {
          background: #32B569;
        }

        .controls {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #373847;
          border-radius: 8px;
        }

        .control-group {
          margin-bottom: 1.5rem;
        }

        .control-group:last-child {
          margin-bottom: 0;
        }

        .control-group h3 {
          margin-bottom: 0.5rem;
          color: #FFF;
        }

        .ring-filters, .tag-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .ring-btn, .tag-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #555;
          background: #272936;
          color: #FFF;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.9rem;
        }

        .ring-btn.active {
          border-color: var(--ring-color, #32B569);
          background: var(--ring-color, #32B569);
          color: white;
        }

        .tag-btn.active {
          border-color: #32B569;
          background: #32B569;
          color: white;
        }

        .ring-btn:hover, .tag-btn:hover {
          border-color: #32B569;
        }

        .legend {
          margin: 2rem 0;
          padding: 1.5rem;
          background: #373847;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .legend h3 {
          margin-bottom: 1rem;
          color: #FFF;
        }

        .legend-items {
          display: grid;
          grid-template-columns: repeat(2, 2fr);
          gap: 1rem;
        }

        .legend-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .legend-color {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .legend-item strong {
          color: #FFF;
          display: block;
          margin-bottom: 0.25rem;
        }

        .legend-item p {
          color: #CCC;
          font-size: 0.9rem;
          margin: 0;
        }

        .dimensions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          grid-template-rows: repeat(2, 1fr);
          gap: 2rem;
          margin-top: 3rem;
        }

        .dimension-section {
          padding: 1.5rem;
          background: #373847;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .dimension-section h3 {
          margin-bottom: 0.5rem;
          font-size: 1.3rem;
          color: #FFF;
        }

        .dimension-description {
          color: #CCC;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .header h1 {
            font-size: 2rem;
          }

          .nav {
            flex-direction: column;
            align-items: center;
          }

          .legend-items {
            grid-template-columns: 1fr;
          }

          .dimensions-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
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