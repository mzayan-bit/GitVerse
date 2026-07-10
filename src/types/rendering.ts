import type { ToneMapping, ShadowMapType } from 'three';

// ---------------------------------------------------------------------------
// Canvas & Renderer
// ---------------------------------------------------------------------------

/** Configuration for the Three.js renderer */
export interface RendererConfig {
  /** Device pixel ratio clamping */
  dpr: [min: number, max: number];
  /** Enable/disable antialiasing */
  antialias: boolean;
  /** Tone mapping mode (ACESFilmic, Linear, Reinhard, etc.) */
  toneMapping: ToneMapping;
  /** Tone mapping exposure */
  toneMappingExposure: number;
  /** Output color space */
  outputColorSpace: string;
  /** Enable shadows */
  shadows: boolean;
  /** Shadow map type */
  shadowMapType?: ShadowMapType;
  /** Enable flat shading */
  flat?: boolean;
  /** Enable linear rendering */
  linear?: boolean;
  /** Power preference for WebGL context */
  powerPreference?: 'high-performance' | 'low-power' | 'default';
}

// ---------------------------------------------------------------------------
// Camera
// ---------------------------------------------------------------------------

/** Configuration for the perspective camera */
export interface CameraConfig {
  /** Field of view in degrees */
  fov: number;
  /** Near clipping plane */
  near: number;
  /** Far clipping plane */
  far: number;
  /** Initial position [x, y, z] */
  position: [x: number, y: number, z: number];
  /** Look-at target [x, y, z] */
  target: [x: number, y: number, z: number];

  // Future extensions
  /** Cinematic fly-through support (placeholder) */
  cinematicMode?: boolean;
  /** Focus target for transitions (placeholder) */
  focusTarget?: [x: number, y: number, z: number] | null;
  /** Transition duration in seconds (placeholder) */
  transitionDuration?: number;
}

/** Configuration for orbit controls */
export interface OrbitControlsConfig {
  /** Enable damping (inertia) */
  enableDamping: boolean;
  /** Damping factor (0–1) */
  dampingFactor: number;
  /** Enable zoom */
  enableZoom: boolean;
  /** Zoom speed multiplier */
  zoomSpeed: number;
  /** Enable rotation */
  enableRotate: boolean;
  /** Rotation speed multiplier */
  rotateSpeed: number;
  /** Enable pan */
  enablePan: boolean;
  /** Pan speed multiplier */
  panSpeed: number;
  /** Minimum distance from target */
  minDistance: number;
  /** Maximum distance from target */
  maxDistance: number;
  /** Minimum polar angle in radians */
  minPolarAngle: number;
  /** Maximum polar angle in radians */
  maxPolarAngle: number;
  /** Auto-rotate */
  autoRotate: boolean;
  /** Auto-rotate speed */
  autoRotateSpeed: number;
}

// ---------------------------------------------------------------------------
// Performance
// ---------------------------------------------------------------------------

/** Performance tier for adaptive quality */
export type PerformanceTier = 'low' | 'medium' | 'high' | 'ultra';

/** Performance monitoring data */
export interface PerformanceData {
  /** Current frames per second */
  fps: number;
  /** Frame delta time in ms */
  delta: number;
  /** Current device pixel ratio */
  dpr: number;
  /** Active performance tier */
  tier: PerformanceTier;
  /** Number of draw calls */
  drawCalls: number;
  /** Number of triangles */
  triangles: number;
  /** Number of geometries in memory */
  geometries: number;
  /** Number of textures in memory */
  textures: number;
}

/** Configuration for the performance monitor */
export interface PerformanceConfig {
  /** Target FPS */
  targetFps: number;
  /** Enable adaptive DPR */
  adaptiveDpr: boolean;
  /** Minimum adaptive DPR */
  minDpr: number;
  /** Maximum adaptive DPR */
  maxDpr: number;
  /** Enable FPS limiting */
  fpsLimit: boolean;
  /** FPS limit value */
  fpsLimitValue: number;
  /** Whether debug mode is active */
  debug: boolean;
}

// ---------------------------------------------------------------------------
// Post-Processing
// ---------------------------------------------------------------------------

/** Configuration for the post-processing pipeline */
export interface PostProcessingConfig {
  /** Enable post-processing globally */
  enabled: boolean;
  /** Bloom settings */
  bloom: BloomConfig;
}

/** Configuration for bloom effect */
export interface BloomConfig {
  /** Enable bloom */
  enabled: boolean;
  /** Bloom intensity */
  intensity: number;
  /** Luminance threshold */
  luminanceThreshold: number;
  /** Luminance smoothing */
  luminanceSmoothing: number;
  /** Mipmap blur */
  mipmapBlur: boolean;
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

/** Scene state accessible via context */
export interface SceneState {
  /** Whether the scene is ready / loaded */
  isReady: boolean;
  /** Whether the scene is currently loading */
  isLoading: boolean;
  /** Optional error message */
  error: string | null;
  /** The underlying Three.js scene (available after mount) */
  scene: import('three').Scene | null;
  /** The active camera */
  camera: import('three').Camera | null;
  /** The WebGL renderer */
  renderer: import('three').WebGLRenderer | null;
}

/** Actions to mutate scene state */
export interface SceneActions {
  setReady: (ready: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setScene: (scene: import('three').Scene | null) => void;
  setCamera: (camera: import('three').Camera | null) => void;
  setRenderer: (renderer: import('three').WebGLRenderer | null) => void;
}

// ---------------------------------------------------------------------------
// Environment
// ---------------------------------------------------------------------------

/** Configuration for environment lighting */
export interface EnvironmentConfig {
  /** Background color (CSS / hex) */
  backgroundColor: string;
  /** Ambient light intensity */
  ambientIntensity: number;
  /** Ambient light color */
  ambientColor: string;
  /** Optional HDR preset for Image Based Lighting */
  preset?: string;
  /** Environment map intensity */
  environmentIntensity?: number;
}

/** Configuration for fog */
export interface FogConfig {
  /** Enable fog */
  enabled: boolean;
  /** Fog color */
  color: string;
  /** Near distance */
  near: number;
  /** Far distance */
  far: number;
}
