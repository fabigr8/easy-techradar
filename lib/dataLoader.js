import radarConfig from '../data/radar-config.json';
import { getRingColor as getUtilRingColor, getDimensionColor as getUtilDimensionColor, getRingIndex } from './colorUtils';

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

// Helper function to get ring color using new color scheme
export function getRingColor(ringId, alpha = 1) {
  const ringIndex = getRingIndex(ringId);
  const color = getUtilRingColor(ringIndex);
  
  if (alpha === 1) return color;
  
  // Convert rgb to rgba with alpha
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  return color;
}

// Helper function to get dimension color using new color scheme
export function getDimensionColor(dimensionId, alpha = 1) {
  const dimensions = getDimensions();
  const dimensionIndex = dimensions.findIndex(d => d.id === dimensionId);
  const color = getUtilDimensionColor(dimensionIndex);
  
  if (alpha === 1) return color;
  
  // Convert rgb to rgba with alpha
  const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  
  return color;
}