/* eslint-disable react-hooks/purity */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CometShowerProps {
  count?: number;
}

export function CometShower({ count = 5 }: CometShowerProps) {
  const groupRef = useRef<THREE.Group>(null);

  const comets = useMemo(() => {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
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

  useFrame((_, delta) => {
    comets.forEach((c) => {
      c.position.addScaledVector(c.direction, c.speed * delta);
      if (c.position.length() > 6000) {
        c.position.set(
          (Math.random() - 0.5) * 3000,
          (Math.random() - 0.5) * 1500,
          (Math.random() - 0.5) * 3000
        );
      }
    });

    if (groupRef.current) {
      groupRef.current.children.forEach((child, idx) => {
        const c = comets[idx];
        if (c && child) {
          child.position.copy(c.position);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {comets.map((c) => (
        <group key={c.id} position={c.position}>
          {/* Head */}
          <mesh>
            <sphereGeometry args={[4, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          {/* Glow */}
          <mesh>
            <sphereGeometry args={[8, 16, 16]} />
            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={0.6}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}
