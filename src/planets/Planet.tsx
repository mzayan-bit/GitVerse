import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetConfig } from './PlanetTypes';
import { PlanetGeometryBuilder } from './Geometry';
import { PlanetMaterialBuilder } from './Materials';
import { AtmosphereLayer, CloudLayer } from './Atmosphere';
import { useLiveState } from '@/universe/Live/LiveStateStore';

export interface PlanetProps {
  config: PlanetConfig;
  position?: [number, number, number];
  lodLevel?: 'high' | 'medium' | 'low';
  autoRotate?: boolean;
  planetId?: string;
}

export function Planet({
  config,
  position = [0, 0, 0],
  lodLevel = 'high',
  autoRotate = true,
  planetId,
}: PlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Subscribe to live metric state
  const metric = useLiveState((s) =>
    planetId ? s.getMetric(planetId) : undefined
  );

  // Dynamically modify material based on live metrics
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
    }

    if (metric && meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      // If failing or high CPU, planet glows orange/red
      if (metric.status === 'failing' || metric.cpuUsage > 80) {
        mat.emissive = new THREE.Color('#ff4400');
        mat.emissiveIntensity = 0.5 + Math.sin(Date.now() / 200) * 0.5; // Pulsing
      } else if (metric.isDeploying) {
        mat.emissive = new THREE.Color('#00ffff');
        mat.emissiveIntensity = 0.3 + Math.sin(Date.now() / 500) * 0.3;
      } else {
        mat.emissive = new THREE.Color('#000000');
        mat.emissiveIntensity = 0;
      }
    }
  });

  const geometry = useMemo(
    () => PlanetGeometryBuilder.build(config.terrain, lodLevel),
    [config.terrain, lodLevel]
  );
  const material = useMemo(() => PlanetMaterialBuilder.build(config), [config]);

  // Materials and geometry are managed by a global cache now.
  // We do not dispose them on unmount to allow reuse.

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
