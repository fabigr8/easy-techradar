import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { getRadarData } from '../lib/dataLoader';

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
      </Head>

      <div className="container">
        <header className="header">
          <nav className="breadcrumb">
            <Link href="/">← Back to Radar</Link>
          </nav>
          
          <h1>Technologies Overview</h1>
          <p>Complete list of all technologies in our radar with detailed information.</p>
        </header>

        {/* Filters and Search */}
        <div className="controls">
          <div className="search-section">
            <input
              type="text"
              placeholder="Search technologies or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="name">Name</option>
                <option value="ring">Ring</option>
                <option value="newest">New First</option>
                <option value="changed">Changed First</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Filter by Ring:</label>
              <select value={filterRing} onChange={(e) => setFilterRing(e.target.value)}>
                <option value="">All Rings</option>
                {radarData.rings.map(ring => (
                  <option key={ring.id} value={ring.id}>{ring.name}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
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
        <div className="results-summary">
          <p>Showing {filteredTechnologies.length} of {radarData.technologies.length} technologies</p>
        </div>

        {/* Technologies Table */}
        <div className="table-container">
          <table className="technologies-table">
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
                  <tr key={tech.id} className="tech-row">
                    <td className="tech-name-cell">
                      <div className="tech-name-container">
                        <strong className="tech-name">{tech.name}</strong>
                        <p className="tech-description">{tech.description}</p>
                      </div>
                    </td>
                    
                    <td className="ring-cell">
                      <span 
                        className="ring-badge"
                        style={{ 
                          backgroundColor: ring?.color,
                          color: 'white'
                        }}
                      >
                        {ring?.name}
                      </span>
                    </td>
                    
                    <td className="dimensions-cell">
                      <div className="dimension-score">
                        <span className="dimension-name">{dimension?.name}</span>
                        <span 
                          className="dimension-badge"
                          style={{ backgroundColor: dimension?.color, color: 'white' }}
                        >
                          {dimension?.name}
                        </span>
                      </div>
                    </td>
                    
                    <td className="tags-cell">
                      <div className="tags-container">
                        {tech.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                        {tech.tags.length > 3 && (
                          <span className="tag overflow">+{tech.tags.length - 3}</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="status-cell">
                      <div className="status-indicators">
                        {tech.isNew && (
                          <span className="indicator new">NEW</span>
                        )}
                        {tech.hasChanged && (
                          <span className="indicator changed">CHANGED</span>
                        )}
                        {!tech.isNew && !tech.hasChanged && (
                          <span className="indicator unchanged">UNCHANGED</span>
                        )}
                      </div>
                    </td>
                    
                    <td className="actions-cell">
                      <div className="actions">
                        <Link 
                          href={`/technologies/${tech.id}`}
                          className="action-btn view-btn"
                        >
                          View Details
                        </Link>
                        {tech.url && (
                          <a 
                            href={tech.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="action-btn external-btn"
                          >
                            Website ↗
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
          <div className="no-results">
            <p>No technologies found matching your criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilterRing('');
                setFilterDimension('');
              }}
              className="reset-btn"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, sans-serif;
        }

        .header {
          margin-bottom: 2rem;
        }

        .breadcrumb {
          margin-bottom: 1rem;
        }

        .breadcrumb a {
          color: #666;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .breadcrumb a:hover {
          color: #333;
        }

        .header h1 {
          font-size: 2.5rem;
          color: #333;
          margin-bottom: 0.5rem;
        }

        .header p {
          color: #666;
          font-size: 1.1rem;
        }

        .controls {
          background: #f8f9fa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 2rem;
        }

        .search-section {
          margin-bottom: 1rem;
        }

        .search-input {
          width: 100%;
          max-width: 400px;
          padding: 0.75rem;
          border: 2px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
        }

        .search-input:focus {
          outline: none;
          border-color: #7CB518;
        }

        .filters {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .filter-group label {
          font-size: 0.9rem;
          font-weight: 500;
          color: #555;
        }

        .filter-group select {
          padding: 0.5rem;
          border: 2px solid #ddd;
          border-radius: 4px;
          background: white;
        }

        .results-summary {
          margin-bottom: 1rem;
          color: #666;
          font-size: 0.9rem;
        }

        .table-container {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          overflow-x: auto;
        }

        .technologies-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .technologies-table th {
          background: #f8f9fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #dee2e6;
        }

        .technologies-table td {
          padding: 1rem;
          border-bottom: 1px solid #dee2e6;
          vertical-align: top;
        }

        .tech-row:hover {
          background: #f8f9fa;
        }

        .tech-name-container {
          max-width: 300px;
        }

        .tech-name {
          color: #333;
          display: block;
          margin-bottom: 0.25rem;
        }

        .tech-description {
          color: #666;
          font-size: 0.9rem;
          margin: 0;
          line-height: 1.4;
        }

        .ring-badge {
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          white-space: nowrap;
        }

        .dimensions-list {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .dimension-score {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.85rem;
        }

        .dimension-name {
          color: #666;
          min-width: 80px;
        }

        .dimension-badge {
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-align: center;
        }

        .show-all-btn {
          background: #e9ecef;
          border: none;
          padding: 0.125rem 0.375rem;
          border-radius: 10px;
          font-size: 0.75rem;
          color: #666;
          cursor: pointer;
          margin-top: 0.25rem;
        }

        .tags-container {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .tag {
          padding: 0.25rem 0.5rem;
          background: #e9ecef;
          color: #495057;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
        }

        .tag.overflow {
          background: #dee2e6;
          color: #6c757d;
        }

        .status-indicators {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .indicator {
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
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

        .actions {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .action-btn {
          padding: 0.375rem 0.75rem;
          border-radius: 4px;
          text-decoration: none;
          font-size: 0.8rem;
          font-weight: 500;
          text-align: center;
          white-space: nowrap;
          transition: all 0.2s;
        }

        .view-btn {
          background: #007bff;
          color: white;
        }

        .view-btn:hover {
          background: #0056b3;
        }

        .external-btn {
          background: #6c757d;
          color: white;
        }

        .external-btn:hover {
          background: #545b62;
        }

        .no-results {
          text-align: center;
          padding: 3rem;
          color: #666;
        }

        .reset-btn {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: #7CB518;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
        }

        .reset-btn:hover {
          background: #6a9c15;
        }

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          .filters {
            flex-direction: column;
          }

          .header h1 {
            font-size: 2rem;
          }

          .table-container {
            margin: 0 -1rem;
            border-radius: 0;
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