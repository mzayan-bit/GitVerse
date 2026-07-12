import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetConfig } from './PlanetTypes';
import { PlanetGeometryBuilder } from './Geometry';
import { PlanetMaterialBuilder } from './Materials';
import { AtmosphereLayer, CloudLayer } from './Atmosphere';

export interface PlanetProps {
  config: PlanetConfig;
  position?: [number, number, number];
  lodLevel?: 'high' | 'medium' | 'low';
}

export function Planet({
  config,
  position = [0, 0, 0],
  lodLevel = 'high',
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotate planet slowly
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  const geometry = useMemo(
    () => PlanetGeometryBuilder.build(config.terrain, lodLevel),
    [config.terrain, lodLevel]
  );
  const material = useMemo(() => PlanetMaterialBuilder.build(config), [config]);

  // Clean up material on unmount or change
  React.useEffect(() => {
    return () => {
      material.dispose();
      geometry.dispose();
    };
  }, [material, geometry]);

  return (
    <group ref={groupRef} position={position}>
      <mesh
        ref={meshRef}
        geometry={geometry}
        material={material}
        castShadow
        receiveShadow
      />

      {config.atmosphere.enabled && (
        <AtmosphereLayer
          terrain={config.terrain}
          atmosphere={config.atmosphere}
        />
      )}

      {config.atmosphere.enabled && config.atmosphere.hasClouds && (
        <CloudLayer terrain={config.terrain} atmosphere={config.atmosphere} />
      )}
    </group>
  );
}
