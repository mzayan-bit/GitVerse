import { GalaxyShape } from './GalaxyTypes';

export const GALAXY_DEFAULTS = {
  MIN_SYSTEMS: 100,
  MAX_SYSTEMS: 5000,

  // Default Bounds
  RADIUS_X: 5000,
  RADIUS_Z: 5000,
  THICKNESS_Y: 800,

  // Arms configuration (for spiral/barred)
  MIN_ARMS: 2,
  MAX_ARMS: 6,

  // Core configuration
  CORE_DENSITY_MULTIPLIER: 5.0, // Core is denser
  CORE_RADIUS_RATIO: 0.15, // Core takes up 15% of galaxy

  // Colors
  CORE_COLORS: ['#ffffff', '#ffcc99', '#ffddaa', '#eebbaa'],
  OUTER_COLORS: ['#4466ff', '#2244cc', '#6688ff', '#88aaff'],

  // Default shapes
  SHAPES: [
    'spiral',
    'barred_spiral',
    'elliptical',
    'ring',
    'irregular',
    'dwarf',
  ] as GalaxyShape[],
};
