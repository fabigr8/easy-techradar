import Link from 'next/link';
import { getRingColor } from '../lib/dataLoader';
import styles from './TechnologyList.module.css';

export default function TechnologyList({ technologies, dimension, rings }) {
  // Group technologies by ring - filter by the specific dimension
  const techsByRing = rings.reduce((acc, ring) => {
    acc[ring.id] = technologies
      .filter(tech => tech.ring === ring.id && tech.dimension === dimension.id)
      .sort((a, b) => a.name.localeCompare(b.name));
    return acc;
  }, {});
  
  return (
    <div className={styles.technologyTable}>
      {/* Table Header with Ring Names */}
      <div className={styles.tableHeader}>
        {rings.map(ring => (
          <div 
            key={ring.id} 
            className={styles.headerCell}
            style={{ borderTopColor: ring.color }}
          >
            <div className={styles.ringIndicator} style={{ backgroundColor: ring.color }}></div>
            <span className={styles.ringName}>{ring.name}</span>
            <span className={styles.techCount}>({techsByRing[ring.id].length})</span>
          </div>
        ))}
      </div>

      {/* Table Body with Technologies */}
      <div className={styles.tableBody}>
        {rings.map(ring => {
          const ringTechs = techsByRing[ring.id];
          
          return (
            <div key={ring.id} className={styles.ringColumn}>
              {ringTechs.map(tech => (
                <Link 
                  key={tech.id} 
                  href={`/technologies/${tech.id}`} 
                  className={styles.techItem}
                  style={{ '--dimension-color': dimension?.color || '#32B569' }}
                >
                  <span className={styles.techName}>{tech.name}</span>
                </Link>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}