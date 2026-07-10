export interface NebulaLayerConfig {
  count: number;
  radius: number;
  baseSize: number;
  opacity: number;
  colors: [string, string]; // e.g. ["#1f005c", "#5b0060"]
  driftSpeed: number;
  noiseScale: number;
}

export interface NebulaConfig {
  layers: {
    back: NebulaLayerConfig;
    middle: NebulaLayerConfig;
    front: NebulaLayerConfig;
  };
}

export type PerformanceTier = 'ultra' | 'high' | 'medium' | 'low';
