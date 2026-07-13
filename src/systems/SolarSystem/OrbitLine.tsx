import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { OrbitConfig } from './SolarSystemTypes';

import { useSolarSystemManager } from './SolarSystemManager';

export interface OrbitLineProps {
  config: OrbitConfig;
}

export function OrbitLine({ config }: OrbitLineProps) {
  const showOrbits = useSolarSystemManager((s) => s.showOrbits);

  const points = useMemo(() => {
    // Generate points instead of geometry directly to use with Drei's Line
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * config.radiusX;
      const z = Math.sin(theta) * config.radiusZ;
      pts.push([x, 0, z] as [number, number, number]);
    }
    return pts;
  }, [config]);

  if (!showOrbits) return null;

  return (
    <group rotation={[config.inclination, 0, 0]}>
      <Line
        points={points}
        color="#ffffff"
        opacity={0.15}
        transparent
        depthWrite={false}
        lineWidth={1}
      />
    </group>
  );
}
