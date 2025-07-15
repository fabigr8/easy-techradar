import radarConfig from '../data/radar-config.json';

export function getRadarData() {
  return radarConfig;
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
  // Get from JSON configuration
  const technology = getTechnology(slug);
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