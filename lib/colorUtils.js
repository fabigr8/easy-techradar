// Color mapping utilities for consistent theming across the app

// Dimension color classes (ordered)
export const dimensionColorClasses = [
  'color_dim1',   // rgb(0, 244, 203)
  'color_dim2',   // rgb(0, 178, 162) 
  'color_dim3',   // rgb(15, 135, 138)
  'color_dim4',   // rgb(15, 106, 115)
  'color_dim5'    // rgb(15, 67, 74)
];

export const dimensionBgColorClasses = [
  'bg_color_dim1',
  'bg_color_dim2', 
  'bg_color_dim3',
  'bg_color_dim4',
  'bg_color_dim5'
];

export const dimensionBorderColorClasses = [
  'border_color_dim1',
  'border_color_dim2',
  'border_color_dim3', 
  'border_color_dim4',
  'border_color_dim5'
];

// Ring color classes (ordered: adopt, trial, assess, hold)
export const ringColorClasses = [
  'color_ring1',   // rgb(87, 207, 128) - adopt
  'color_ring2',   // rgb(1, 112, 173) - trial
  'color_ring3',   // rgb(18, 171, 219) - assess
  'color_ring4'    // rgb(168, 66, 224) - hold
];

export const ringBgColorClasses = [
  'bg_color_ring1',
  'bg_color_ring2',
  'bg_color_ring3', 
  'bg_color_ring4'
];

export const ringBorderColorClasses = [
  'border_color_ring1',
  'border_color_ring2',
  'border_color_ring3',
  'border_color_ring4'
];

// Color values for programmatic use (charts, etc.)
export const dimensionColors = [
  'rgb(0, 244, 203)',
  'rgb(0, 178, 162)',
  'rgb(15, 135, 138)',
  'rgb(15, 106, 115)',
  'rgb(15, 67, 74)'
];

export const ringColors = [
  'rgb(87, 207, 128)',  // adopt
  'rgb(1, 112, 173)',   // trial
  'rgb(18, 171, 219)',  // assess
  'rgb(168, 66, 224)'   // hold
];

// Helper functions
export function getDimensionColorClass(dimensionIndex, type = 'color') {
  const classes = {
    color: dimensionColorClasses,
    bg: dimensionBgColorClasses,
    border: dimensionBorderColorClasses
  };
  return classes[type][dimensionIndex] || classes[type][0];
}

export function getRingColorClass(ringIndex, type = 'color') {
  const classes = {
    color: ringColorClasses,
    bg: ringBgColorClasses,
    border: ringBorderColorClasses
  };
  return classes[type][ringIndex] || classes[type][0];
}

export function getDimensionColor(dimensionIndex) {
  return dimensionColors[dimensionIndex] || dimensionColors[0];
}

export function getRingColor(ringIndex) {
  return ringColors[ringIndex] || ringColors[0];
}

// Ring order mapping
export const ringOrder = ['adopt', 'trial', 'assess', 'hold'];

export function getRingIndex(ringId) {
  return ringOrder.indexOf(ringId);
}
