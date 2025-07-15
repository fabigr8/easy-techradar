import React, { useState } from 'react';
import Link from 'next/link';

export default function RadarChart({ dimensions, technologies, selectedRing = null }) {
  const [hoveredTech, setHoveredTech] = useState(null);
  
  const size = 600;
  const center = size / 2;
  const maxRadius = size / 2 - 50;
  
  // Filter technologies based on selected ring
  const filteredTechnologies = selectedRing 
    ? technologies.filter(tech => tech.ring === selectedRing)
    : technologies;

  // Calculate polygon vertices for each ring
  const getPolygonVertices = (radius) => {
    const vertices = [];
    const angleStep = (2 * Math.PI) / dimensions.length;
    
    for (let i = 0; i < dimensions.length; i++) {
      const angle = i * angleStep - Math.PI / 2;
      vertices.push({
        x: center + Math.cos(angle) * radius,
        y: center + Math.sin(angle) * radius
      });
    }
    return vertices;
  };

  // Convert vertices to SVG path
  const verticesToPath = (vertices) => {
    if (vertices.length === 0) return '';
    
    let path = `M ${vertices[0].x} ${vertices[0].y}`;
    for (let i = 1; i < vertices.length; i++) {
      path += ` L ${vertices[i].x} ${vertices[i].y}`;
    }
    path += ' Z';
    return path;
  };

  // Calculate positions for each technology
  const getTechPosition = (tech) => {
    const ringOrder = ['adopt', 'trial', 'assess', 'hold'];
    const ringIndex = ringOrder.indexOf(tech.ring);
    const ringRadius = (ringIndex + 1) * (maxRadius / 4);
    
    // Find the dimension this technology belongs to
    const dimensionIndex = dimensions.findIndex(d => d.id === tech.dimension);
    const angleStep = (2 * Math.PI) / dimensions.length;
    const angle = dimensionIndex * angleStep - Math.PI / 2;
    
    // Add some randomness to avoid overlap, but keep within the sector
    const sectorWidth = angleStep * 0.8; // 80% of sector width to avoid overlap
    const randomRadius = ringRadius * (0.7 + Math.random() * 0.3); // 70-100% of ring radius
    const randomAngle = angle + (Math.random() - 0.5) * sectorWidth;
    
    return {
      x: center + Math.cos(randomAngle) * randomRadius,
      y: center + Math.sin(randomAngle) * randomRadius,
      ring: ringIndex,
      dimension: dimensions.find(d => d.id === tech.dimension)
    };
  };

  const techPositions = filteredTechnologies.map(tech => ({
    ...tech,
    position: getTechPosition(tech)
  }));

  // Get ring colors from your data
  const ringColors = {
    adopt: '#588157',
    trial: '#457b9d', 
    assess: '#bc6c25',
    hold: '#d62828'
  };

  return (
    <div className="radar-chart-container">
      <svg width={size} height={size} className="radar-chart">
        {/* Background polygons for each ring */}
        {['adopt', 'trial', 'assess', 'hold'].map((ringId, index) => {
          const ringColor = ringColors[ringId];
          const radius = (index + 1) * (maxRadius / 4);
          const vertices = getPolygonVertices(radius);
          
          return (
            <path
              key={ringId}
              d={verticesToPath(vertices)}
              fill="none"
              stroke={ringColor}
              strokeWidth="2"
              strokeOpacity="0.3"
            />
          );
        })}
        
        {/* Dimension lines from center to vertices */}
        {dimensions.map((dimension, index) => {
          const angleStep = (2 * Math.PI) / dimensions.length;
          const angle = index * angleStep - Math.PI / 2;
          const outerVertex = {
            x: center + Math.cos(angle) * maxRadius,
            y: center + Math.sin(angle) * maxRadius
          };
          
          return (
            <g key={dimension.id}>
              <line
                x1={center}
                y1={center}
                x2={outerVertex.x}
                y2={outerVertex.y}
                stroke="#ddd"
                strokeWidth="1"
              />
              <text
                x={center + Math.cos(angle) * (maxRadius + 20)}
                y={center + Math.sin(angle) * (maxRadius + 20)}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#333"
                fontSize="12"
                fontWeight="bold"
              >
                {dimension.name}
              </text>
            </g>
          );
        })}
        
        {/* Sector separator lines (optional - makes sectors more visible) */}
        {dimensions.map((dimension, index) => {
          const angleStep = (2 * Math.PI) / dimensions.length;
          const angle = (index + 0.5) * angleStep - Math.PI / 2;
          const outerPoint = {
            x: center + Math.cos(angle) * maxRadius,
            y: center + Math.sin(angle) * maxRadius
          };
          
          return (
            <line
              key={`separator-${index}`}
              x1={center}
              y1={center}
              x2={outerPoint.x}
              y2={outerPoint.y}
              stroke="#f0f0f0"
              strokeWidth="1"
              strokeDasharray="5,5"
            />
          );
        })}
        
        {/* Technology dots */}
        {techPositions.map(tech => {
          const ringColor = ringColors[tech.ring];
          const isHovered = hoveredTech === tech.id;
          
          return (
            <g key={tech.id}>
              <circle
                cx={tech.position.x}
                cy={tech.position.y}
                r={isHovered ? 8 : 6}
                fill={ringColor}
                stroke="white"
                strokeWidth="2"
                className="tech-dot"
                onMouseEnter={() => setHoveredTech(tech.id)}
                onMouseLeave={() => setHoveredTech(null)}
                style={{ cursor: 'pointer' }}
              />
              
              {/* Technology indicators */}
              {tech.isNew && (
                <circle
                  cx={tech.position.x + 8}
                  cy={tech.position.y - 8}
                  r="3"
                  fill="#28a745"
                  stroke="white"
                  strokeWidth="1"
                />
              )}
              
              {tech.hasChanged && (
                <circle
                  cx={tech.position.x + 8}
                  cy={tech.position.y + 8}
                  r="3"
                  fill="#ffc107"
                  stroke="white"
                  strokeWidth="1"
                />
              )}
              
              {/* Hover tooltip */}
              {isHovered && (
                <g>
                  <rect
                    x={tech.position.x + 15}
                    y={tech.position.y - 10}
                    width="120"
                    height="20"
                    fill="rgba(0,0,0,0.8)"
                    rx="4"
                  />
                  <text
                    x={tech.position.x + 20}
                    y={tech.position.y + 3}
                    fill="white"
                    fontSize="12"
                    fontWeight="bold"
                  >
                    {tech.name}
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Ring labels */}
      <div className="ring-labels">
        {[
          { id: 'adopt', name: 'Adopt', color: '#588157' },
          { id: 'trial', name: 'Trial', color: '#457b9d' },
          { id: 'assess', name: 'Assess', color: '#bc6c25' },
          { id: 'hold', name: 'Hold', color: '#d62828' }
        ].map(ring => (
          <div key={ring.id} className="ring-label" style={{ color: ring.color }}>
            {ring.name}
          </div>
        ))}
      </div>

      <style jsx>{`
        .radar-chart-container {
          position: relative;
          margin: 2rem 0;
          padding: 1rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .radar-chart {
          max-width: 100%;
          height: auto;
        }

        .tech-dot {
          transition: all 0.2s ease;
        }

        .tech-dot:hover {
          filter: brightness(1.2);
        }

        .ring-labels {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .ring-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.9rem;
          font-weight: 600;
        }

        .ring-label::before {
          content: '';
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: currentColor;
        }

        @media (max-width: 768px) {
          .radar-chart-container {
            padding: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
