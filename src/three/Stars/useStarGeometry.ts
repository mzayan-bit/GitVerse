import { useMemo } from 'react';
import * as THREE from 'three';
import { StarGenerator } from './StarGenerator';
import type { StarLayerConfig } from '@/types/stars';

/**
 * Procedurally generates and memoizes BufferGeometry for a star layer.
 */
export function useStarGeometry(
  config: StarLayerConfig,
  colorTemperatureRange: [number, number]
) {
  return useMemo(() => {
    const data = StarGenerator.generateLayer(config, colorTemperatureRange);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(data.positions, 3)
    );
    geometry.setAttribute('aColor', new THREE.BufferAttribute(data.colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(data.sizes, 1));
    geometry.setAttribute(
      'twinklePhase',
      new THREE.BufferAttribute(data.twinklePhases, 1)
    );

    return geometry;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.count, config.radius, config.baseSize, colorTemperatureRange]);
}
