'use client';

import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import { StarMaterial } from './StarMaterial';
import { useStarGeometry } from './useStarGeometry';
import type { StarLayerConfig } from '@/types/stars';

// Extend Three.js with our custom shader material
extend({ StarMaterial });

// Add TypeScript definition for the custom element
declare module '@react-three/fiber' {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    starMaterial: any;
  }
}

interface StarFieldProps {
  config: StarLayerConfig;
  colorTemperatureRange: [number, number];
  twinkleFactor: number;
}

export function StarField({
  config,
  colorTemperatureRange,
  twinkleFactor,
}: StarFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate and memoize the BufferGeometry
  const geometry = useStarGeometry(config, colorTemperatureRange);

  // Animation Loop (Twinkling & Drifting)
  useFrame((state, delta) => {
    if (materialRef.current) {
      // Update uTime for twinkling
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    if (pointsRef.current) {
      // Slow subtle drift around the Y axis
      pointsRef.current.rotation.y += delta * 0.05 * config.driftSpeed;
      // Slight drift around X axis to feel organic
      pointsRef.current.rotation.x += delta * 0.02 * config.driftSpeed;
    }
  });

  // Cleanup geometry on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  return (
    <points ref={pointsRef} geometry={geometry}>
      <starMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms-uTwinkleSpeed-value={config.twinkleSpeed}
        uniforms-uTwinkleFactor-value={twinkleFactor}
        uniforms-uOpacity-value={config.opacity}
      />
    </points>
  );
}
