import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useImpactManager } from '../ImpactManager';
import { useEntityManager } from '@/entities/EntityManager';
import { Line } from '@react-three/drei';

export function ImpactVisualizer() {
  const { report, isActive } = useImpactManager();
  const { entities } = useEntityManager();

  // If we are not in impact mode or there is no report, don't render impact visuals.
  if (!isActive || !report) return null;

  return (
    <group>
      {/* Render Halos for affected planets */}
      {report.affectedRepositories.map((repoId) => {
        const entity = entities[repoId];
        if (!entity || !entity.transform) return null;

        return (
          <mesh key={`halo-${repoId}`} position={entity.transform.position}>
            <sphereGeometry args={[3.5, 32, 32]} />
            <meshBasicMaterial
              color="#ef4444"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              side={THREE.BackSide}
            />
          </mesh>
        );
      })}

      {/* Render Dependency Paths */}
      {report.criticalPaths.map((path, pathIdx) => {
        // Build an array of points for the line
        const points: THREE.Vector3[] = [];

        path.nodes.forEach((nodeId) => {
          const entity = entities[nodeId];
          if (entity && entity.transform) {
            points.push(new THREE.Vector3(...entity.transform.position));
          }
        });

        if (points.length < 2) return null;

        // Create a spline to make the path curved and beautiful
        const curve = new THREE.CatmullRomCurve3(points);
        const smoothPoints = curve.getPoints(50 * points.length);

        return (
          <group key={`path-${pathIdx}`}>
            {/* Base dim line */}
            <Line
              points={smoothPoints}
              color="#64748b"
              lineWidth={1}
              transparent
              opacity={0.2}
            />
            {/* Animated Energy Pulse along the line */}
            <EnergyPulse curve={curve} riskScore={path.cumulativeRisk} />
          </group>
        );
      })}
    </group>
  );
}

function EnergyPulse({
  curve,
  riskScore,
}: {
  curve: THREE.CatmullRomCurve3;
  riskScore: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  // Color based on risk (Red for high, Orange/Yellow for med, Cyan for low)
  const color =
    riskScore > 0.5 ? '#ef4444' : riskScore > 0.2 ? '#f97316' : '#3b82f6';

  useFrame((state) => {
    if (!meshRef.current) return;

    // Animate along the curve based on time
    const time = (state.clock.elapsedTime * 0.2) % 1;
    const position = curve.getPointAt(time);

    meshRef.current.position.copy(position);

    // Face the direction of movement
    if (time + 0.01 <= 1) {
      const tangent = curve.getTangentAt(time);
      meshRef.current.lookAt(position.clone().add(tangent));
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
      <pointLight color={color} distance={10} intensity={2} />
    </mesh>
  );
}
