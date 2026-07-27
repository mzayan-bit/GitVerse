import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface IdleFloatingMotionProps {
  children: React.ReactNode;
  floatAmplitude?: number;
  floatSpeed?: number;
  rotationSpeed?: number;
}

export function IdleFloatingMotion({
  children,
  floatAmplitude = 1.5,
  floatSpeed = 1.2,
  rotationSpeed = 0.2,
}: IdleFloatingMotionProps) {
  const groupRef = useRef<THREE.Group>(null);
  const initialY = useRef<number | null>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (initialY.current === null) {
      initialY.current = groupRef.current.position.y;
    }

    const time = state.clock.getElapsedTime();
    // Gentle sine wave bobbing
    groupRef.current.position.y =
      initialY.current + Math.sin(time * floatSpeed) * floatAmplitude;

    // Slow atmospheric rotation
    groupRef.current.rotation.y += delta * rotationSpeed;
  });

  return <group ref={groupRef}>{children}</group>;
}
