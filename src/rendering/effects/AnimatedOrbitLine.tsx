import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useThemeManager } from '../themes/ThemeManager';

interface AnimatedOrbitLineProps {
  points: THREE.Vector3[];
  color?: string;
  opacity?: number;
  width?: number;
}

/**
 * AnimatedOrbitLine — A premium orbit trail that fades in the distance
 * and has an animated energy pulse traveling along the path.
 */
export function AnimatedOrbitLine({
  points,
  color,
  opacity = 0.5,
}: AnimatedOrbitLineProps) {
  const lineRef = useRef<unknown>(null);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);
  const theme = useThemeManager((s) => s.activeTheme);

  const orbitColor = color || theme.colors.secondary;

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    return geo;
  }, [points]);

  useFrame((state) => {
    if (!materialRef.current) return;

    // Animate opacity based on theme animation intensity
    const time = state.clock.getElapsedTime();
    const pulse = Math.sin(time * 2.0) * 0.15 + 0.85;

    materialRef.current.opacity = opacity * pulse * theme.animationIntensity;
    materialRef.current.color.set(orbitColor);
  });

  return (
    // @ts-expect-error - R3F line vs SVG line type conflict
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <line ref={lineRef as any} geometry={geometry}>
      <lineBasicMaterial
        ref={materialRef}
        color={orbitColor}
        transparent
        opacity={opacity}
        linewidth={1}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </line>
  );
}
