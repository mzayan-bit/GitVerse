export type QualityPresetName =
  'Low' | 'Balanced' | 'High' | 'Ultra' | 'Experimental';

export interface QualityPresetConfig {
  name: QualityPresetName;
  pixelRatio: number;
  shadowsEnabled: boolean;
  shadowMapSize: number;
  bloomEnabled: boolean;
  bloomIntensity: number;
  particleDensity: number;
  lodDistanceMultiplier: number;
  maxDrawDistance: number;
  postProcessingEnabled: boolean;
}

export const GRAPHICS_PRESETS: Record<QualityPresetName, QualityPresetConfig> =
  {
    Low: {
      name: 'Low',
      pixelRatio: 0.8,
      shadowsEnabled: false,
      shadowMapSize: 512,
      bloomEnabled: false,
      bloomIntensity: 0.0,
      particleDensity: 0.3,
      lodDistanceMultiplier: 0.6,
      maxDrawDistance: 4000,
      postProcessingEnabled: false,
    },
    Balanced: {
      name: 'Balanced',
      pixelRatio: 1.0,
      shadowsEnabled: true,
      shadowMapSize: 1024,
      bloomEnabled: true,
      bloomIntensity: 0.5,
      particleDensity: 0.7,
      lodDistanceMultiplier: 0.85,
      maxDrawDistance: 6000,
      postProcessingEnabled: true,
    },
    High: {
      name: 'High',
      pixelRatio: 1.0,
      shadowsEnabled: true,
      shadowMapSize: 2048,
      bloomEnabled: true,
      bloomIntensity: 0.8,
      particleDensity: 1.0,
      lodDistanceMultiplier: 1.0,
      maxDrawDistance: 8000,
      postProcessingEnabled: true,
    },
    Ultra: {
      name: 'Ultra',
      pixelRatio: 1.25,
      shadowsEnabled: true,
      shadowMapSize: 4096,
      bloomEnabled: true,
      bloomIntensity: 1.2,
      particleDensity: 1.5,
      lodDistanceMultiplier: 1.3,
      maxDrawDistance: 12000,
      postProcessingEnabled: true,
    },
    Experimental: {
      name: 'Experimental',
      pixelRatio: 1.5,
      shadowsEnabled: true,
      shadowMapSize: 4096,
      bloomEnabled: true,
      bloomIntensity: 1.6,
      particleDensity: 2.0,
      lodDistanceMultiplier: 1.6,
      maxDrawDistance: 16000,
      postProcessingEnabled: true,
    },
  };
