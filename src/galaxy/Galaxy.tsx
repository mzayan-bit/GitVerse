import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGalaxyManager } from './GalaxyManager';
import { GalaxyFactory } from './GalaxyFactory';

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

      // Add random rotation and scale for variety
      matrix.scale(
        new THREE.Vector3(
          geometryData.sizes[i],
          geometryData.sizes[i],
          geometryData.sizes[i]
        )
      );

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
              setCameraMode('galaxy-follow'); // Will zoom in and transition
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
        <icosahedronGeometry args={[5, 0]} />
        <meshBasicMaterial
          vertexColors={false} // We use instanceColor
          toneMapped={false}
          transparent={true}
          opacity={0.9}
        />
      </instancedMesh>
    </group>
  );
}
