import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGalaxyManager } from './GalaxyManager';
import { GalaxyFactory } from './GalaxyFactory';
import { GraphEdges } from '@/components/canvas/GraphEdges';

export function Galaxy() {
  const { galaxyConfig, generateGalaxy } = useGalaxyManager();

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

  // Memory cleanup and InstancedMesh generation
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current || !geometryData) return;

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    for (let i = 0; i < geometryData.systemCount; i++) {
      matrix.setPosition(
        geometryData.positions[i * 3],
        geometryData.positions[i * 3 + 1],
        geometryData.positions[i * 3 + 2]
      );

      // Scale nodes properly so they don't clip into camera
      const scaledSize = Math.max(
        2,
        Math.min(25, geometryData.sizes[i] * 0.05)
      );
      matrix.scale(new THREE.Vector3(scaledSize, scaledSize, scaledSize));

      meshRef.current.setMatrixAt(i, matrix);

      color.setRGB(
        geometryData.colors[i * 3],
        geometryData.colors[i * 3 + 1],
        geometryData.colors[i * 3 + 2]
      );
      meshRef.current.setColorAt(i, color);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [geometryData]);

  // Slow galactic rotation
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.005;
    }
  });

  if (!galaxyConfig || !geometryData) return null;

  return (
    <group>
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, geometryData.systemCount]}
        onClick={(e) => {
          e.stopPropagation();
          if (e.instanceId !== undefined && galaxyConfig) {
            const system = galaxyConfig.systems[e.instanceId];
            if (system) {
              const { setFocusedSystemId, setCameraMode } =
                useGalaxyManager.getState();
              setFocusedSystemId(system.id);
              setCameraMode('galaxy-follow');
            }
          }
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          roughness={0.3}
          metalness={0.7}
          toneMapped={false}
        />
      </instancedMesh>
      <GraphEdges />
    </group>
  );
}
