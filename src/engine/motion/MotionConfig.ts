import { create } from 'zustand';

export type MotionQualityPreset = 'low' | 'balanced' | 'ultra';

export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
  precision: number;
}

export const SPRING_PRESETS: Record<string, SpringConfig> = {
  gentle: { stiffness: 120, damping: 14, mass: 1, precision: 0.001 },
  snappy: { stiffness: 240, damping: 20, mass: 0.8, precision: 0.001 },
  elastic: { stiffness: 180, damping: 10, mass: 1.2, precision: 0.001 },
  smooth: { stiffness: 90, damping: 16, mass: 1, precision: 0.001 },
  bounce: { stiffness: 300, damping: 8, mass: 0.9, precision: 0.001 },
};

export interface MotionConfigState {
  qualityPreset: MotionQualityPreset;
  reducedMotion: boolean;
  globalSpeed: number; // 1.0 = normal, 0.5 = half speed, 0 = instant
  setQualityPreset: (preset: MotionQualityPreset) => void;
  setReducedMotion: (reduced: boolean) => void;
  setGlobalSpeed: (speed: number) => void;
}

export const useMotionConfig = create<MotionConfigState>((set) => ({
  qualityPreset: 'ultra',
  reducedMotion:
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  globalSpeed: 1.0,

  setQualityPreset: (preset) => set({ qualityPreset: preset }),
  setReducedMotion: (reduced) => set({ reducedMotion: reduced }),
  setGlobalSpeed: (speed) => set({ globalSpeed: speed }),
}));
