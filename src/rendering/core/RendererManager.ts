import { create } from 'zustand';

// ── Quality Profiles ──────────────────────────────────────────────────
export type QualityPreset = 'low' | 'medium' | 'high' | 'ultra';

export interface QualityProfile {
  renderScale: number;
  shadowMapSize: number;
  maxLights: number;
  antialias: boolean;
  hdr: boolean;
  toneMapping: 'aces' | 'reinhard' | 'linear' | 'cineon';
  toneMappingExposure: number;
  gammaCorrection: boolean;
  environmentMap: boolean;
  physicallyBased: boolean;
  pixelRatio: number;
}

export const QUALITY_PRESETS: Record<QualityPreset, QualityProfile> = {
  low: {
    renderScale: 0.75,
    shadowMapSize: 512,
    maxLights: 4,
    antialias: false,
    hdr: false,
    toneMapping: 'reinhard',
    toneMappingExposure: 1.0,
    gammaCorrection: true,
    environmentMap: false,
    physicallyBased: false,
    pixelRatio: 1,
  },
  medium: {
    renderScale: 1.0,
    shadowMapSize: 1024,
    maxLights: 8,
    antialias: true,
    hdr: true,
    toneMapping: 'aces',
    toneMappingExposure: 1.2,
    gammaCorrection: true,
    environmentMap: true,
    physicallyBased: true,
    pixelRatio: 1,
  },
  high: {
    renderScale: 1.0,
    shadowMapSize: 2048,
    maxLights: 16,
    antialias: true,
    hdr: true,
    toneMapping: 'aces',
    toneMappingExposure: 1.3,
    gammaCorrection: true,
    environmentMap: true,
    physicallyBased: true,
    pixelRatio:
      typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
  },
  ultra: {
    renderScale: 1.25,
    shadowMapSize: 4096,
    maxLights: 32,
    antialias: true,
    hdr: true,
    toneMapping: 'aces',
    toneMappingExposure: 1.4,
    gammaCorrection: true,
    environmentMap: true,
    physicallyBased: true,
    pixelRatio:
      typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1,
  },
};

// ── Post Processing Config ────────────────────────────────────────────
export interface PostFXConfig {
  bloom: {
    enabled: boolean;
    intensity: number;
    threshold: number;
    smoothing: number;
  };
  ssao: { enabled: boolean; intensity: number; radius: number };
  depthOfField: {
    enabled: boolean;
    focusDistance: number;
    focalLength: number;
    bokehScale: number;
  };
  chromaticAberration: { enabled: boolean; offset: number };
  vignette: { enabled: boolean; darkness: number; offset: number };
  fxaa: { enabled: boolean };
  motionBlur: { enabled: boolean; intensity: number };
  volumetricLight: { enabled: boolean; intensity: number };
}

export const POST_FX_PRESETS: Record<QualityPreset, PostFXConfig> = {
  low: {
    bloom: { enabled: true, intensity: 0.3, threshold: 0.9, smoothing: 0.3 },
    ssao: { enabled: false, intensity: 0, radius: 0 },
    depthOfField: {
      enabled: false,
      focusDistance: 0,
      focalLength: 0,
      bokehScale: 0,
    },
    chromaticAberration: { enabled: false, offset: 0 },
    vignette: { enabled: true, darkness: 0.4, offset: 0.3 },
    fxaa: { enabled: true },
    motionBlur: { enabled: false, intensity: 0 },
    volumetricLight: { enabled: false, intensity: 0 },
  },
  medium: {
    bloom: { enabled: true, intensity: 0.5, threshold: 0.8, smoothing: 0.4 },
    ssao: { enabled: false, intensity: 0, radius: 0 },
    depthOfField: {
      enabled: false,
      focusDistance: 0,
      focalLength: 0,
      bokehScale: 0,
    },
    chromaticAberration: { enabled: true, offset: 0.0005 },
    vignette: { enabled: true, darkness: 0.5, offset: 0.25 },
    fxaa: { enabled: true },
    motionBlur: { enabled: false, intensity: 0 },
    volumetricLight: { enabled: false, intensity: 0 },
  },
  high: {
    bloom: { enabled: true, intensity: 0.7, threshold: 0.7, smoothing: 0.5 },
    ssao: { enabled: true, intensity: 0.5, radius: 0.3 },
    depthOfField: {
      enabled: true,
      focusDistance: 10,
      focalLength: 0.02,
      bokehScale: 2,
    },
    chromaticAberration: { enabled: true, offset: 0.0008 },
    vignette: { enabled: true, darkness: 0.6, offset: 0.2 },
    fxaa: { enabled: true },
    motionBlur: { enabled: true, intensity: 0.3 },
    volumetricLight: { enabled: true, intensity: 0.3 },
  },
  ultra: {
    bloom: { enabled: true, intensity: 1.0, threshold: 0.6, smoothing: 0.6 },
    ssao: { enabled: true, intensity: 0.8, radius: 0.5 },
    depthOfField: {
      enabled: true,
      focusDistance: 10,
      focalLength: 0.025,
      bokehScale: 3,
    },
    chromaticAberration: { enabled: true, offset: 0.001 },
    vignette: { enabled: true, darkness: 0.7, offset: 0.15 },
    fxaa: { enabled: true },
    motionBlur: { enabled: true, intensity: 0.5 },
    volumetricLight: { enabled: true, intensity: 0.5 },
  },
};

// ── Renderer Store ────────────────────────────────────────────────────
interface RendererStore {
  qualityPreset: QualityPreset;
  quality: QualityProfile;
  postFx: PostFXConfig;

  setQualityPreset: (preset: QualityPreset) => void;
  setPostFxOption: <K extends keyof PostFXConfig>(
    key: K,
    value: PostFXConfig[K]
  ) => void;
  toggleEffect: (key: keyof PostFXConfig, enabled: boolean) => void;
}

export const useRendererManager = create<RendererStore>((set) => ({
  qualityPreset: 'high',
  quality: QUALITY_PRESETS.high,
  postFx: POST_FX_PRESETS.high,

  setQualityPreset: (preset) =>
    set({
      qualityPreset: preset,
      quality: QUALITY_PRESETS[preset],
      postFx: POST_FX_PRESETS[preset],
    }),

  setPostFxOption: (key, value) =>
    set((s) => ({ postFx: { ...s.postFx, [key]: value } })),

  toggleEffect: (key, enabled) =>
    set((s) => ({
      postFx: {
        ...s.postFx,
        [key]: { ...s.postFx[key], enabled },
      },
    })),
}));
