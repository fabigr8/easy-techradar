import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getRadarData() {
  const configPath = path.join(process.cwd(), 'data/radar-config.json');
  const rawData = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(rawData);
}

export function getTechnology(id) {
  const radarData = getRadarData();
  return radarData.technologies.find(tech => tech.id === id);
}

export function getTechnologies() {
  const radarData = getRadarData();
  return radarData.technologies;
}

export function getDimensions() {
  const radarData = getRadarData();
  return radarData.dimensions;
}

export function getRings() {
  const radarData = getRadarData();
  return radarData.rings;
}

export function getTechnologiesByRing(ringId) {
  const technologies = getTechnologies();
  return technologies.filter(tech => tech.ring === ringId);
}

export function getTechnologiesByTag(tag) {
  const technologies = getTechnologies();
  return technologies.filter(tech => tech.tags.includes(tag));
}

export function getAllTags() {
  const technologies = getTechnologies();
  const tags = new Set();
  technologies.forEach(tech => {
    tech.tags.forEach(tag => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function getTechnologyDetails(slug) {
  // First try to get from JSON
  const technology = getTechnology(slug);
  if (!technology) return null;

  // Try to get additional markdown content
  const techPath = path.join(process.cwd(), 'data/technologies', `${slug}.md`);
  
  if (fs.existsSync(techPath)) {
    const fileContents = fs.readFileSync(techPath, 'utf8');
    const { data, content } = matter(fileContents);
    return { 
      ...technology, 
      ...data, 
      content 
    };
  }
  
  return technology;
}

// Helper function to get ring color
export function getRingColor(ringId, alpha = 1) {
  const rings = getRings();
  const ring = rings.find(r => r.id === ringId);
  if (!ring) return `rgba(128, 128, 128, ${alpha})`;
  
  // Convert hex to rgba
  const hex = ring.color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Helper function to get dimension color
export function getDimensionColor(dimensionId, alpha = 1) {
  const dimensions = getDimensions();
  const dimension = dimensions.find(d => d.id === dimensionId);
  if (!dimension) return `rgba(128, 128, 128, ${alpha})`;
  
  // Convert hex to rgba
  const hex = dimension.color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}