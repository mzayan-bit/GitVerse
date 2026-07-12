import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetConfig } from './PlanetTypes';

export interface PlanetProps {
  config: PlanetConfig;
  position?: [number, number, number];
}

export function Planet({ config, position = [0, 0, 0] }: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Rotate planet slowly
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  // Basic geometry for now. Will be replaced by procedural geometry.
  const geometry = useMemo(
    () => new THREE.SphereGeometry(config.terrain.baseRadius, 64, 64),
    [config.terrain.baseRadius]
  );

  // Basic material for now. Will be replaced by procedural material.
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: config.material.colorPalette[0] || '#ffffff',
      roughness: config.material.roughness,
      metalness: config.material.metalness,
    });
  }, [config.material]);

  return (
    <group ref={groupRef} position={position}>
      <mesh geometry={geometry} material={material} castShadow receiveShadow />
    </group>
  );
}
