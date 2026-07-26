import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { OrbitConfig } from './SolarSystemTypes';
import { useSolarSystemManager } from './SolarSystemManager';
import { useThemeManager } from '@/rendering/themes/ThemeManager';

export interface OrbitLineProps {
  config: OrbitConfig;
}

export function OrbitLine({ config }: OrbitLineProps) {
  const showOrbits = useSolarSystemManager((s) => s.showOrbits);
  const theme = useThemeManager((s) => s.activeTheme);
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  const geometry = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * config.radiusX;
      const z = Math.sin(theta) * config.radiusZ;
      pts.push(new THREE.Vector3(x, 0, z));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [config]);

  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.getElapsedTime();
    // Offset pulse based on orbit radius so they don't all pulse at once
    const offset = config.radiusX * 0.01;
    const pulse = Math.sin(time * 1.5 + offset) * 0.3 + 0.7; // 0.4 to 1.0 range

    materialRef.current.opacity = 0.15 * pulse * theme.animationIntensity;
    materialRef.current.color.set(theme.colors.secondary);
  });

  if (!showOrbits) return null;

  return (
    <group rotation={[config.inclination, 0, 0]}>
      {/* @ts-expect-error - R3F line vs SVG line type conflict */}
      <line geometry={geometry}>
        <lineBasicMaterial
          ref={materialRef}
          color={theme.colors.secondary}
          transparent
          opacity={0.15}
          linewidth={1}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </line>
    </group>
  );
}
