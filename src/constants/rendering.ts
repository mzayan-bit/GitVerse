import { ACESFilmicToneMapping, SRGBColorSpace, PCFSoftShadowMap } from 'three';
import type {
  RendererConfig,
  CameraConfig,
  OrbitControlsConfig,
  PerformanceConfig,
  PostProcessingConfig,
  EnvironmentConfig,
  FogConfig,
} from '@/types/rendering';

// ---------------------------------------------------------------------------
// Renderer defaults
// ---------------------------------------------------------------------------

export const DEFAULT_RENDERER_CONFIG: RendererConfig = {
  dpr: [1, 1.5],
  antialias: true,
  toneMapping: ACESFilmicToneMapping,
  toneMappingExposure: 1.0,
  outputColorSpace: SRGBColorSpace,
  shadows: true,
  shadowMapType: PCFSoftShadowMap,
  powerPreference: 'high-performance',
};

// ---------------------------------------------------------------------------
// Camera defaults
// ---------------------------------------------------------------------------

export const DEFAULT_CAMERA_CONFIG: CameraConfig = {
  fov: 50,
  near: 0.1,
  far: 100000,
  position: [0, 0, 20],
  target: [0, 0, 0],
};

export const DEFAULT_ORBIT_CONTROLS_CONFIG: OrbitControlsConfig = {
  enableDamping: true,
  dampingFactor: 0.05,
  enableZoom: true,
  zoomSpeed: 0.8,
  enableRotate: true,
  rotateSpeed: 0.5,
  enablePan: true,
  panSpeed: 0.5,
  minDistance: 2,
  maxDistance: 50000,
  minPolarAngle: 0,
  maxPolarAngle: Math.PI,
  autoRotate: false,
  autoRotateSpeed: 0.5,
};

// ---------------------------------------------------------------------------
// Performance defaults
// ---------------------------------------------------------------------------

export const DEFAULT_PERFORMANCE_CONFIG: PerformanceConfig = {
  targetFps: 60,
  adaptiveDpr: true,
  minDpr: 1,
  maxDpr: 1.5,
  fpsLimit: false,
  fpsLimitValue: 60,
  debug: process.env.NODE_ENV === 'development',
};

// ---------------------------------------------------------------------------
// Post-processing defaults
// ---------------------------------------------------------------------------

export const DEFAULT_POST_PROCESSING_CONFIG: PostProcessingConfig = {
  enabled: true,
  bloom: {
    enabled: true,
    intensity: 1.5,
    luminanceThreshold: 0.1,
    luminanceSmoothing: 0.9,
    mipmapBlur: true,
  },
  vignette: {
    enabled: true,
    offset: 0.5,
    darkness: 0.5,
  },
  noise: {
    enabled: false,
    opacity: 0.05,
  },
  chromaticAberration: {
    enabled: false,
    offset: [0.002, 0.002],
  },
};

// ---------------------------------------------------------------------------
// Environment defaults
// ---------------------------------------------------------------------------

export const DEFAULT_ENVIRONMENT_CONFIG: EnvironmentConfig = {
  backgroundColor: '#000000',
  ambientIntensity: 0.1,
  ambientColor: '#ffffff',
  preset: 'night',
  environmentIntensity: 0.5,
};

// ---------------------------------------------------------------------------
// Fog defaults
// ---------------------------------------------------------------------------

export const DEFAULT_FOG_CONFIG: FogConfig = {
  enabled: false,
  color: '#000000',
  near: 50,
  far: 300,
};
