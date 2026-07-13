import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGalaxyManager } from './GalaxyManager';
import { GalaxyFactory } from './GalaxyFactory';

export function Galaxy() {
  const { galaxyConfig, generateGalaxy } = useGalaxyManager();
  const pointsRef = useRef<THREE.Points>(null);

  // Initialize on mount if missing
  useEffect(() => {
    if (!galaxyConfig) {
      generateGalaxy('gitverse-genesis-galaxy');
    }
  }, [galaxyConfig, generateGalaxy]);

  // Memoize geometry data
  const geometryData = useMemo(() => {
    if (!galaxyConfig) return null;
    return GalaxyFactory.createGalaxyGeometryData(galaxyConfig);
  }, [galaxyConfig]);

  // Slow galactic rotation
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.005;
    }
  });

  if (!galaxyConfig || !geometryData) return null;

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={geometryData.systemCount}
            array={geometryData.positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={geometryData.systemCount}
            array={geometryData.colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={geometryData.systemCount}
            array={geometryData.sizes}
            itemSize={1}
          />
        </bufferGeometry>
        {/* We use a custom shader material later, but for Step 1 PointsMaterial is fine */}
        <pointsMaterial
          size={5}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
