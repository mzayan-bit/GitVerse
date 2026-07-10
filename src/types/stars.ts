export type StarDensity = 'low' | 'medium' | 'high' | 'ultra';

export enum StarLayer {
  Near = 'near',
  Medium = 'medium',
  Far = 'far',
  DeepSpace = 'deepSpace',
}

export interface StarLayerConfig {
  /** Number of stars in this layer */
  count: number;
  /** The radius of the sphere/box within which stars are generated */
  radius: number;
  /** Base size multiplier for stars in this layer */
  baseSize: number;
  /** Opacity multiplier for this layer */
  opacity: number;
  /** Speed multiplier for drifting */
  driftSpeed: number;
  /** Speed multiplier for twinkling */
  twinkleSpeed: number;
}

export interface StarConfig {
  /** The specific density setting to use */
  density: StarDensity;
  /** Configuration for each depth layer */
  layers: Record<StarLayer, StarLayerConfig>;
  /** Range for random color temperature (Kelvin) interpolation */
  colorTemperatureRange: [number, number];
  /** Twinkle intensity factor (0-1) */
  twinkleFactor: number;
}

/** Data generated per star to populate BufferGeometry */
export interface StarData {
  position: [number, number, number];
  color: [number, number, number];
  size: number;
  twinklePhase: number;
}
