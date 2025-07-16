import Link from 'next/link';
import { getRingColor } from '../lib/dataLoader';

export default function TechnologyList({ technologies, dimension, rings }) {
  // Group technologies by ring - filter by the specific dimension
  const techsByRing = rings.reduce((acc, ring) => {
    acc[ring.id] = technologies
      .filter(tech => tech.ring === ring.id && tech.dimension === dimension.id)
      .sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {});
  
  return (
    <div className="technology-table">
      {/* Table Header with Ring Names */}
      <div className="table-header">
        {rings.map(ring => (
          <div 
            key={ring.id} 
            className="header-cell"
            style={{ borderTopColor: ring.color }}
          >
            <div className="ring-indicator" style={{ backgroundColor: ring.color }}></div>
            <span className="ring-name">{ring.name}</span>
            <span className="tech-count">({techsByRing[ring.id].length})</span>
          </div>
        ))}
      </div>

      {/* Table Body with Technologies */}
      <div className="table-body">
        {rings.map(ring => {
          const ringTechs = techsByRing[ring.id];
          
          return (
            <div key={ring.id} className="ring-column">
              {ringTechs.map(tech => (
                <Link 
                  key={tech.id} 
                  href={`/technologies/${tech.id}`} 
                  className="tech-item"
                >
                  <span className="tech-name">{tech.name}</span>
                </Link>
              ))}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .technology-table {
          width: 100%;
        }

        .table-header {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          margin-bottom: 1px;
        }

        .header-cell {
          background: #373847; #2a2d3a 
          padding: 0.9rem;
          text-align: center;
          border-top: 3px solid;
          border-radius: 6px 6px 0 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .ring-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }

        .ring-name {
          font-weight: 600;
          color: #FFF;
          font-size: 0.9rem;
        }

        .tech-count {
          color: #CCC;
          font-size: 0.8rem;
        }

        .table-body {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1px;
          min-height: 200px;
        }

        .ring-column {
          background: #373847; 
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          border-radius: 0 0 6px 6px;
        }

        .tech-item {
          display: block;
          padding: 0.75rem;
          background: #2a2d3a;
          border-radius: 6px;
          text-decoration: none;
          color: #FFF;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }

        .tech-item:hover {
          background: #373847;
          border-left-color: ${dimension?.color || '#32B569'};
          transform: translateX(2px);
        }

        .tech-name {
          font-weight: 600;
          color: #FFF;
          font-size: 0.9rem;
          line-height: 1.3;
        }

        @media (max-width: 768px) {
          .table-header,
          .table-body {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .table-header,
          .table-body {
            grid-template-columns: 1fr;
          }
          
          .header-cell {
            border-radius: 6px;
            margin-bottom: 0.5rem;
          }
          
          .ring-column {
            border-radius: 6px;
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
}