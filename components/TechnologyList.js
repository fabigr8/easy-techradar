import Link from 'next/link';
import { getRingColor } from '../lib/dataLoader';

export default function TechnologyList({ technologies, dimension, rings }) {
  // Group technologies by ring
  const techsByRing = rings.reduce((acc, ring) => {
    acc[ring.id] = technologies
      .filter(tech => tech.ring === ring.id)
      .sort((a, b) => (b.dimensions[dimension.id] || 0) - (a.dimensions[dimension.id] || 0));
    return acc;
  }, {});

  return (
    <div className="technology-list">
      {rings.map(ring => {
        const ringTechs = techsByRing[ring.id];
        if (ringTechs.length === 0) return null;

        return (
          <div key={ring.id} className="ring-section">
            <h4 className="ring-title" style={{ color: ring.color }}>
              {ring.name} ({ringTechs.length})
            </h4>
            <ul className="tech-list">
              {ringTechs.map(tech => (
                <li key={tech.id} className="tech-item">
                  <Link href={`/technologies/${tech.id}`} className="tech-link">
                    <div className="tech-content">
                      <div className="tech-header">
                        <span className="tech-name">{tech.name}</span>
                        <div className="tech-indicators">
                          {tech.isNew && (
                            <span className="indicator new">NEW</span>
                          )}
                          {tech.hasChanged && (
                            <span className="indicator changed">CHANGED</span>
                          )}
                        </div>
                      </div>
                      <div className="tech-score">
                        Score: {tech.dimensions[dimension.id] || 0}/10
                      </div>
                      <div className="tech-tags">
                        {tech.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                        {tech.tags.length > 3 && (
                          <span className="tag">+{tech.tags.length - 3}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        );
      })}

      <style jsx>{`
        .technology-list {
          space-y: 1.5rem;
        }

        .ring-section {
          margin-bottom: 1.5rem;
        }

        .ring-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          padding-bottom: 0.25rem;
          border-bottom: 2px solid currentColor;
        }

        .tech-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .tech-item {
          margin-bottom: 0.5rem;
        }

        .tech-link {
          display: block;
          padding: 0.75rem;
          background: #f8f9fa;
          border-radius: 6px;
          text-decoration: none;
          color: inherit;
          transition: all 0.2s;
          border-left: 4px solid transparent;
        }

        .tech-link:hover {
          background: #e9ecef;
          border-left-color: ${dimension?.color || '#7CB518'};
          transform: translateX(2px);
        }

        .tech-content {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .tech-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .tech-name {
          font-weight: 600;
          color: #333;
          flex: 1;
        }

        .tech-indicators {
          display: flex;
          gap: 0.25rem;
        }

        .indicator {
          padding: 0.125rem 0.375rem;
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

        .tech-score {
          font-size: 0.85rem;
          color: #666;
          font-weight: 500;
        }

        .tech-tags {
          display: flex;
          gap: 0.25rem;
          flex-wrap: wrap;
        }

        .tag {
          padding: 0.125rem 0.5rem;
          background: #e9ecef;
          color: #495057;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .tech-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .tech-indicators {
            margin-top: 0.25rem;
          }
        }