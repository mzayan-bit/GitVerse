'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const count = 20; // Sparse shooting stars

// Generate initial state outside component to avoid React Compiler impurity errors
const dummy = new THREE.Object3D();
const initialPos = new Float32Array(count * 3);
const initialVel = new Float32Array(count * 3);
const initialLife = new Float32Array(count);

for (let i = 0; i < count; i++) {
  const r = 200;
  initialPos[i * 3] = (Math.random() - 0.5) * r;
  initialPos[i * 3 + 1] = (Math.random() - 0.5) * r;
  initialPos[i * 3 + 2] = (Math.random() - 0.5) * r;

  const speed = 150 + Math.random() * 200;
  initialVel[i * 3] = (Math.random() - 0.5) * speed;
  initialVel[i * 3 + 1] = (Math.random() - 0.5) * speed;
  initialVel[i * 3 + 2] = (Math.random() - 0.5) * speed;

  initialLife[i] = Math.random() * 2.0;
}

export function ShootingStars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Clone initial state into a mutable ref to avoid modifying module-level constants across unmounts/remounts
  const stateRef = useRef({
    startPositions: new Float32Array(initialPos),
    velocities: new Float32Array(initialVel),
    lifetimes: new Float32Array(initialLife),
  });

  const { startPositions, velocities, lifetimes } = stateRef.current;

  useFrame((_state, delta) => {
    if (!meshRef.current) return;

    for (let i = 0; i < count; i++) {
      lifetimes[i] -= delta;

      // Reset if died
      if (lifetimes[i] < 0) {
        lifetimes[i] = 1.0 + Math.random() * 2.0;

        const r = 250;
        startPositions[i * 3] = (Math.random() - 0.5) * r;
        startPositions[i * 3 + 1] = (Math.random() - 0.5) * r;
        startPositions[i * 3 + 2] = (Math.random() - 0.5) * r;
      }

      // Move
      startPositions[i * 3] += velocities[i * 3] * delta;
      startPositions[i * 3 + 1] += velocities[i * 3 + 1] * delta;
      startPositions[i * 3 + 2] += velocities[i * 3 + 2] * delta;

      dummy.position.set(
        startPositions[i * 3],
        startPositions[i * 3 + 1],
        startPositions[i * 3 + 2]
      );

      // Align to velocity
      const target = dummy.position
        .clone()
        .add(
          new THREE.Vector3(
            velocities[i * 3],
            velocities[i * 3 + 1],
            velocities[i * 3 + 2]
          )
        );
      dummy.lookAt(target);

      // Scale based on lifetime to create a fading effect
      const scaleZ = 10 * (lifetimes[i] > 1 ? 2 - lifetimes[i] : lifetimes[i]);
      dummy.scale.set(0.1, 0.1, Math.max(scaleZ, 0.1));

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial
        color="#ffffff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
