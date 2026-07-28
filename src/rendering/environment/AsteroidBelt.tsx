/* eslint-disable react-hooks/purity */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidBeltProps {
  count?: number;
  innerRadius?: number;
  outerRadius?: number;
  center?: [number, number, number];
}

export function AsteroidBelt({
  count = 600,
  innerRadius = 800,
  outerRadius = 1400,
  center = [0, 0, 0],
}: AsteroidBeltProps) {
  const instancedRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const asteroidTransforms = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
      const x = center[0] + Math.cos(angle) * radius;
      const z = center[2] + Math.sin(angle) * radius;
      const y = center[1] + (Math.random() - 0.5) * 60;

      const scale = Math.random() * 2.5 + 0.8;
      const rotX = Math.random() * Math.PI;
      const rotY = Math.random() * Math.PI;
      const rotZ = Math.random() * Math.PI;

      items.push({ x, y, z, scale, rotX, rotY, rotZ, angle, radius });
    }
    return items;
  }, [count, innerRadius, outerRadius, center]);

  useEffect(() => {
    if (!instancedRef.current) return;
    asteroidTransforms.forEach((ast, i) => {
      dummy.position.set(ast.x, ast.y, ast.z);
      dummy.rotation.set(ast.rotX, ast.rotY, ast.rotZ);
      dummy.scale.setScalar(ast.scale);
      dummy.updateMatrix();
      instancedRef.current?.setMatrixAt(i, dummy.matrix);
    });
    instancedRef.current.instanceMatrix.needsUpdate = true;
  }, [asteroidTransforms, dummy]);

  useFrame((_, delta) => {
    if (instancedRef.current) {
      instancedRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <instancedMesh
      ref={instancedRef}
      args={[undefined, undefined, count]}
      castShadow={false}
      receiveShadow={false}
    >
      <dodecahedronGeometry args={[2.5, 1]} />
      <meshStandardMaterial color="#849495" roughness={0.8} metalness={0.2} />
    </instancedMesh>
  );
}
