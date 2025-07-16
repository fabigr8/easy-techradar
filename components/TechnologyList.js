import Link from 'next/link';
import { getRingColor } from '../lib/dataLoader';
import { getDimensionColorClass, getRingColorClass, getRingIndex } from '../lib/colorUtils';
import styles from './TechnologyList.module.css';

export default function TechnologyList({ technologies, dimension, dimensionIndex = 0, rings }) {
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
        {rings.map((ring, ringIndex) => (
          <div 
            key={ring.id} 
            className={`${styles.headerCell} ${getRingColorClass(ringIndex, 'border')}`}
          >
            <div className={`${styles.ringIndicator} ${getRingColorClass(ringIndex, 'bg')}`}></div>
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
                  className={`${styles.techItem} ${getDimensionColorClass(dimensionIndex, 'border')}`}
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