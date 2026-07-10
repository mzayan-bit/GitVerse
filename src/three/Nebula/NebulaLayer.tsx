'use client';

import { useMemo, useRef, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { NebulaGenerator } from './NebulaGenerator';
import { NebulaMaterial } from './NebulaMaterial';
import type { NebulaLayerConfig } from '@/types/nebula';

extend({ NebulaMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nebulaMaterial: any;
  }
}

interface NebulaLayerProps {
  config: NebulaLayerConfig;
}

export function NebulaLayer({ config }: NebulaLayerProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Generate and memoize the geometry for this layer
  const geometry = useMemo(() => {
    const data = NebulaGenerator.generateLayer(config);

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(data.positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(data.colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(data.sizes, 1));
    geo.setAttribute('opacity', new THREE.BufferAttribute(data.opacities, 1));
    geo.setAttribute('rotation', new THREE.BufferAttribute(data.rotations, 1));

    return geo;
  }, [config]);

  // Clean up geometry on unmount
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  useFrame((state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      // Extremely slow rotation around Y for the whole nebula layer
      pointsRef.current.rotation.y += delta * 0.02 * config.driftSpeed;
      pointsRef.current.rotation.z += delta * 0.005 * config.driftSpeed;
    }
  });

  return (
    <points ref={pointsRef} geometry={geometry}>
      <nebulaMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms-uNoiseScale-value={config.noiseScale}
      />
    </points>
  );
}
