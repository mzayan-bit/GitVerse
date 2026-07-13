import React, { useMemo } from 'react';
import * as THREE from 'three';
import { OrbitConfig } from './SolarSystemTypes';
import { OrbitMechanics } from './OrbitMechanics';
import { useSolarSystemManager } from './SolarSystemManager';

export interface OrbitLineProps {
  config: OrbitConfig;
}

export function OrbitLine({ config }: OrbitLineProps) {
  const showOrbits = useSolarSystemManager((s) => s.showOrbits);

  const geometry = useMemo(() => {
    return OrbitMechanics.generateOrbitLineGeometry(config);
  }, [config]);

  if (!showOrbits) return null;

  return (
    <line geometry={geometry}>
      <lineBasicMaterial
        color="#ffffff"
        opacity={0.15}
        transparent
        depthWrite={false}
      />
    </line>
  );
}
