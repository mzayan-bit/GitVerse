/* eslint-disable react-hooks/immutability */
'use client';

import { useThree, useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei';
import type { PerformanceConfig, PerformanceTier } from '@/types/rendering';
import { DEFAULT_PERFORMANCE_CONFIG } from '@/constants/rendering';
import { useSceneStore } from '@/store/scene-store';

interface PerformanceManagerProps {
  config?: Partial<PerformanceConfig>;
}

/**
 * Monitors rendering performance and applies adaptive DPR.
 * Updates the scene store with current FPS, draw calls, etc.
 * Must be a child of `<Canvas>`.
 */
function PerformanceManager({ config }: PerformanceManagerProps) {
  const merged: PerformanceConfig = {
    ...DEFAULT_PERFORMANCE_CONFIG,
    ...config,
  };

  const gl = useThree((s) => s.gl);
  const setPerformanceData = useSceneStore((s) => s.setPerformanceData);
  const setPerformanceTier = useSceneStore((s) => s.setPerformanceTier);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    lastTimeRef.current = performance.now();
  }, []);

  // Sample renderer info every ~30 frames for the store
  useFrame((_state, delta) => {
    frameCountRef.current += 1;

    if (frameCountRef.current >= 30) {
      const now = performance.now();
      const elapsed = (now - lastTimeRef.current) / 1000;
      const fps = elapsed > 0 ? Math.round(frameCountRef.current / elapsed) : 0;

      const info = gl.info;
      setPerformanceData({
        fps,
        delta: delta * 1000,
        dpr: gl.getPixelRatio(),
        drawCalls: info.render.calls,
        triangles: info.render.triangles,
        geometries: info.memory.geometries,
        textures: info.memory.textures,
      });

      frameCountRef.current = 0;
      lastTimeRef.current = now;
    }
  });

  // Reset renderer info each frame to get per-frame counts
  useEffect(() => {
    gl.info.autoReset = true;
  }, [gl]);

  const handleIncline = () => {
    const current = useSceneStore.getState().performanceTier;
    const tiers: PerformanceTier[] = ['low', 'medium', 'high', 'ultra'];
    const idx = tiers.indexOf(current);
    if (idx < tiers.length - 1) {
      setPerformanceTier(tiers[idx + 1]);
    }
  };

  const handleDecline = () => {
    const current = useSceneStore.getState().performanceTier;
    const tiers: PerformanceTier[] = ['low', 'medium', 'high', 'ultra'];
    const idx = tiers.indexOf(current);
    if (idx > 0) {
      setPerformanceTier(tiers[idx - 1]);
    }
  };

  return (
    <>
      <PerformanceMonitor
        onIncline={handleIncline}
        onDecline={handleDecline}
        flipflops={3}
        onFallback={() => setPerformanceTier('low')}
      />
      {merged.adaptiveDpr && <AdaptiveDpr pixelated />}
    </>
  );
}

export { PerformanceManager };
export type { PerformanceManagerProps };
