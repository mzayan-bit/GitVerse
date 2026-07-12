'use client';

import { useMemo } from 'react';
import { useSceneStore } from '@/store/scene-store';
import { PlanetFactory } from '@/planets/PlanetFactory';
import { Planet } from '@/planets/Planet';
import { Float } from '@react-three/drei';

export function PlanetShowcase3D() {
  const currentPlanetSeed = useSceneStore((s) => s.currentPlanetSeed);

  const planetConfig = useMemo(() => {
    return PlanetFactory.create(currentPlanetSeed);
  }, [currentPlanetSeed]);

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Planet config={planetConfig} position={[0, -2, 0]} lodLevel="high" />
    </Float>
  );
}
