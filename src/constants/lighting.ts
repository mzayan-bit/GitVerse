export interface LightingConfig {
  ambient: {
    intensity: number;
    color: string;
  };
  directional: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
  rim: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
  core: {
    intensity: number;
    color: string;
    position: [number, number, number];
  };
}

export const DEFAULT_LIGHTING_CONFIG: LightingConfig = {
  ambient: {
    intensity: 0.1,
    color: '#ffffff',
  },
  directional: {
    intensity: 0.5,
    color: '#ffffff',
    position: [10, 20, 10],
  },
  rim: {
    intensity: 2.0,
    color: '#4f46e5', // Indigo rim light for cinematic edge highlighting
    position: [-10, 0, -10],
  },
  core: {
    intensity: 1.5,
    color: '#fb923c', // Warm orange/pink galactic core light
    position: [0, -10, 0],
  },
};
