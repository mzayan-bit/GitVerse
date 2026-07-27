import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useInteractionStore } from '@/navigation/interaction/InteractionStore';

export interface FocusRingProps {
  position: [number, number, number];
  radius?: number;
  entityId: string;
}

export function FocusRing({ position, radius = 25, entityId }: FocusRingProps) {
  const innerRingRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);

  const isSelected = useInteractionStore((s) =>
    s.selectedTargets.includes(entityId)
  );
  const isHovered = useInteractionStore(
    (s) => s.hoveredTarget?.entityId === entityId
  );

  useFrame((state, delta) => {
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z += delta * 0.8;
    }
    if (outerRingRef.current) {
      outerRingRef.current.rotation.z -= delta * 0.5;
    }
  });

  if (!isSelected && !isHovered) return null;

  const color = isSelected ? '#6366f1' : '#38bdf8';
  const opacity = isSelected ? 0.8 : 0.4;

  return (
    <group position={position}>
      {/* Inner Pulsing Ring */}
      <mesh ref={innerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.05, radius * 1.12, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Dashed Accent Ring */}
      <mesh ref={outerRingRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[radius * 1.2, radius * 1.24, 48]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={opacity * 0.5}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
