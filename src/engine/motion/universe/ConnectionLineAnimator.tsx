import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface ConnectionLineAnimatorProps {
  start: [number, number, number];
  end: [number, number, number];
  color?: string;
  pulseSpeed?: number;
}

export function ConnectionLineAnimator({
  start,
  end,
  color = '#6366f1',
  pulseSpeed = 2.0,
}: ConnectionLineAnimatorProps) {
  const lineRef = useRef<THREE.Line>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  const geometry = useMemo(() => {
    const pts = [new THREE.Vector3(...start), new THREE.Vector3(...end)];
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [start, end]);

  useFrame((state) => {
    if (!materialRef.current) return;
    const time = state.clock.getElapsedTime();
    const pulse = Math.sin(time * pulseSpeed) * 0.25 + 0.75;
    materialRef.current.opacity = 0.4 * pulse;
  });

  return (
    // @ts-expect-error - R3F line vs SVG line type conflict
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <line ref={lineRef as any} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color={color}
        transparent
        opacity={0.4}
        linewidth={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
}
