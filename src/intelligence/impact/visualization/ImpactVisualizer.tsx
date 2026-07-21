import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useImpactManager } from '../ImpactManager';
import { useEntityManager } from '@/entities/EntityManager';
import { Line } from '@react-three/drei';
import { ImpactPath } from '../ImpactTypes';

export function ImpactVisualizer() {
  const report = useImpactManager((s) => s.report);
  const isActive = useImpactManager((s) => s.isActive);
  const entities = useEntityManager((s) => s.entities);

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
        return (
          <PathVisualizer
            key={`path-${pathIdx}`}
            path={path}
            entities={entities}
          />
        );
      })}
    </group>
  );
}

function PathVisualizer({
  path,
  entities,
}: {
  path: ImpactPath;
  entities: Record<
    string,
    { transform?: { position: [number, number, number] } }
  >;
}) {
  const splineData = useMemo(() => {
    const points: THREE.Vector3[] = [];
    path.nodes.forEach((nodeId: string) => {
      const entity = entities[nodeId];
      if (entity && entity.transform) {
        points.push(new THREE.Vector3(...entity.transform.position));
      }
    });

    if (points.length < 2) return null;

    const curve = new THREE.CatmullRomCurve3(points);
    const smoothPoints = curve.getPoints(50 * points.length);

    return { curve, smoothPoints };
  }, [path.nodes, entities]);

  if (!splineData) return null;

  return (
    <group>
      {/* Base dim line */}
      <Line
        points={splineData.smoothPoints}
        color="#64748b"
        lineWidth={1}
        transparent
        opacity={0.2}
      />
      {/* Animated Energy Pulse along the line */}
      <EnergyPulse curve={splineData.curve} riskScore={path.cumulativeRisk} />
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

  // Pre-allocate dummy vectors to prevent GC spikes in useFrame
  const positionDummy = useMemo(() => new THREE.Vector3(), []);
  const tangentDummy = useMemo(() => new THREE.Vector3(), []);
  const lookAtDummy = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Animate along the curve based on time
    const time = (state.clock.elapsedTime * 0.2) % 1;

    curve.getPointAt(time, positionDummy);
    meshRef.current.position.copy(positionDummy);

    // Face the direction of movement
    if (time + 0.01 <= 1) {
      curve.getTangentAt(time, tangentDummy);
      lookAtDummy.copy(positionDummy).add(tangentDummy);
      meshRef.current.lookAt(lookAtDummy);
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
