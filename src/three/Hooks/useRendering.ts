'use client';

import { useSceneStore } from '@/store/scene-store';
import type { PerformanceData, PerformanceTier } from '@/types/rendering';

/**
 * Returns current performance data from the rendering pipeline.
 */
export function usePerformanceData(): PerformanceData {
  return useSceneStore((s) => s.performanceData);
}

/**
 * Returns the current performance tier.
 */
export function usePerformanceTier(): PerformanceTier {
  return useSceneStore((s) => s.performanceTier);
}

/**
 * Returns whether the 3D scene is ready (canvas mounted + scene initialised).
 */
export function useSceneReady(): boolean {
  return useSceneStore((s) => s.isReady);
}

/**
 * Returns whether the 3D scene is currently loading.
 */
export function useSceneLoading(): boolean {
  return useSceneStore((s) => s.isLoading);
}

/**
 * Returns whether debug mode is active.
 */
export function useDebugMode(): boolean {
  return useSceneStore((s) => s.debugMode);
}
