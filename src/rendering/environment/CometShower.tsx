/* eslint-disable react-hooks/purity */
import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CometShowerProps {
  count?: number;
}

export function CometShower({ count = 5 }: CometShowerProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const comets = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 4000,
          (Math.random() - 0.5) * 2000,
          (Math.random() - 0.5) * 4000
        ),
        direction: new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 2
        ).normalize(),
        speed: Math.random() * 200 + 150,
      });
    }
    return items;
  }, [count]);

  useEffect(() => {
    if (!meshRef.current) return;
    comets.forEach((c, i) => {
      dummy.position.copy(c.position);
      dummy.scale.setScalar(3);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [comets, dummy]);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    comets.forEach((c, i) => {
      c.position.addScaledVector(c.direction, c.speed * delta);
      if (c.position.length() > 6000) {
        c.position.set(
          (Math.random() - 0.5) * 3000,
          (Math.random() - 0.5) * 1500,
          (Math.random() - 0.5) * 3000
        );
      }
      dummy.position.copy(c.position);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#7df4ff" toneMapped={false} />
    </instancedMesh>
  );
}
