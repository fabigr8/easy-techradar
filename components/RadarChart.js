import React, { useState } from 'react';
import Link from 'next/link';
import { getRingColor, getDimensionColor } from '../lib/colorUtils';
import styles from './RadarChart.module.css';

export default function RadarChart({ dimensions, technologies, selectedRing = null, size = 900 }) {
  const [hoveredTech, setHoveredTech] = useState(null);
  
  const center = size / 2;
  const maxRadius = size / 2 - (size > 400 ? 80 : 40); // Adjust margin based on size
  
  // Filter technologies based on selected ring
  const filteredTechnologies = selectedRing 
    ? technologies.filter(tech => tech.ring === selectedRing)
    : technologies;

  // Calculate polygon vertices for each ring
  const getPolygonVertices = (radius) => {
    const vertices = [];
    const angleStep = (2 * Math.PI) / dimensions.length;
    
    for (let i = 0; i < dimensions.length; i++) {
      const angle = i * angleStep - Math.PI / 2; // Start from top
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

  // Calculate edge midpoints for dimension labels
  const getEdgeMidpoints = (radius) => {
    const vertices = getPolygonVertices(radius);
    const midpoints = [];
    
    for (let i = 0; i < vertices.length; i++) {
      const current = vertices[i];
      const next = vertices[(i + 1) % vertices.length];
      
      midpoints.push({
        x: (current.x + next.x) / 2,
        y: (current.y + next.y) / 2
      });
    }
    return midpoints;
  };

  // Calculate positions for each technology
  const getTechPosition = (tech) => {
    const ringOrder = ['adopt', 'trial', 'assess', 'hold'];
    const ringIndex = ringOrder.indexOf(tech.ring);
    const ringRadius = (ringIndex + 1) * (maxRadius / 4);
    
    // Find the dimension this technology belongs to
    const dimensionIndex = dimensions.findIndex(d => d.id === tech.dimension);
    const angleStep = (2 * Math.PI) / dimensions.length;
    
    // The key fix: Calculate the edge midpoint angle for this dimension
    // Each edge is between vertex i and vertex i+1, so edge i has midpoint at angle i + 0.5
    const edgeMidpointAngle = (dimensionIndex + 0.5) * angleStep - Math.PI / 2;
    
    // Use tech.id to create consistent but pseudo-random positioning within the edge sector
    const seed = tech.id.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const sectorWidth = angleStep * 0.6; // 60% of sector width to avoid overlap with adjacent edges
    const randomRadius = ringRadius * (0.7 + (seed % 100) / 100 * 0.3); // 70-100% of ring radius
    
    // Position around the edge midpoint angle with some random spread
    const randomAngle = edgeMidpointAngle + ((seed % 200) / 200 - 0.5) * sectorWidth;
    
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

  // Get ring colors from new color scheme
  const ringColors = {
    adopt: getRingColor(0),
    trial: getRingColor(1), 
    assess: getRingColor(2),
    hold: getRingColor(3)
  };

  return (
    <div className={styles.radarChartContainer}>
      <svg width={size} height={size} className={styles.radarChart}>
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
              strokeWidth="4"
              strokeOpacity="0.3"
            />
          );
        })}
        
        {/* Dimension sector backgrounds with alternating shades */}
        {dimensions.map((dimension, index) => {
          const angleStep = (2 * Math.PI) / dimensions.length;
          
          // Get the two vertices that define this dimension sector
          const currentVertexAngle = index * angleStep - Math.PI / 2;
          const nextVertexAngle = (index + 1) * angleStep - Math.PI / 2;
          
          const currentVertex = {
            x: center + Math.cos(currentVertexAngle) * maxRadius,
            y: center + Math.sin(currentVertexAngle) * maxRadius
          };
          
          const nextVertex = {
            x: center + Math.cos(nextVertexAngle) * maxRadius,
            y: center + Math.sin(nextVertexAngle) * maxRadius
          };
          
          // Create triangular sector path with straight edges
          const sectorPath = `M ${center} ${center} L ${currentVertex.x} ${currentVertex.y} L ${nextVertex.x} ${nextVertex.y} Z`;
          
          // Alternate background shade - every second dimension is slightly darker
          const isAlternate = index % 2 === 1;
          const backgroundColor = isAlternate ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
          
          return (
            <path
              key={`sector-${dimension.id}`}
              d={sectorPath}
              fill={backgroundColor}
              stroke="none"
            />
          );
        })}
        
        {/* Dimension separator lines from center to vertices (these define the edge sector boundaries) */}
        {dimensions.map((dimension, index) => {
          const angleStep = (2 * Math.PI) / dimensions.length;
          const angle = index * angleStep - Math.PI / 2;
          const outerVertex = {
            x: center + Math.cos(angle) * maxRadius,
            y: center + Math.sin(angle) * maxRadius
          };
          
          return (
            <line
              key={dimension.id}
              x1={center}
              y1={center}
              x2={outerVertex.x}
              y2={outerVertex.y}
              stroke="#555"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Dimension labels positioned at edge midpoints */}
        {dimensions.map((dimension, index) => {
          const edgeMidpoints = getEdgeMidpoints(maxRadius);
          const midpoint = edgeMidpoints[index];
          
          // Calculate direction from center to midpoint for label positioning
          const dx = midpoint.x - center;
          const dy = midpoint.y - center;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const labelOffset = size > 400 ? 35 : 25;
          
          const labelX = midpoint.x + (dx / distance) * labelOffset;
          const labelY = midpoint.y + (dy / distance) * labelOffset;
          
          return (
            <text
              key={`label-${dimension.id}`}
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#FFF"
              fontSize={size > 400 ? "14" : "10"}
              fontWeight="bold"
            >
              {dimension.name}
            </text>
          );
        })}
        
        {/* Technology dots */}
        {techPositions.map(tech => {
          const ringColor = ringColors[tech.ring];
          const isHovered = hoveredTech === tech.id;
          const dotRadius = size > 400 ? (isHovered ? 8 : 6) : (isHovered ? 6 : 4);
          
          return (
            <g key={tech.id}>
              <circle
                cx={tech.position.x}
                cy={tech.position.y}
                r={dotRadius}
                fill={ringColor}
                stroke="white"
                strokeWidth="2"
                className={styles.techDot}
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
                  {(() => {
                    const fontSize = size > 400 ? 12 : 10;
                    const textWidth = tech.name.length * (fontSize * 0.6) + 20; // Approximate text width
                    const tooltipX = tech.position.x + 15;
                    const tooltipY = tech.position.y - 15;
                    
                    return (
                      <>
                        <rect
                          x={tooltipX}
                          y={tooltipY - 10}
                          width={textWidth}
                          height="20"
                          fill="rgba(0,0,0,0.9)"
                          rx="4"
                          stroke="rgba(255,255,255,0.2)"
                          strokeWidth="1"
                        />
                        <text
                          x={tooltipX + 10}
                          y={tooltipY + 3}
                          fill="white"
                          fontSize={fontSize}
                          fontWeight="bold"
                        >
                          {tech.name}
                        </text>
                      </>
                    );
                  })()}
                </g>
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Ring labels */}
      <div className={styles.ringLabels}>
        {[
          { id: 'adopt', name: 'Adopt', colorIndex: 0 },
          { id: 'trial', name: 'Trial', colorIndex: 1 },
          { id: 'assess', name: 'Assess', colorIndex: 2 },
          { id: 'hold', name: 'Hold', colorIndex: 3 }
        ].map(ring => (
          <div key={ring.id} className={styles.ringLabel} style={{ color: getRingColor(ring.colorIndex) }}>
            {ring.name}
          </div>
        ))}
      </div>
    </div>
  );
}
