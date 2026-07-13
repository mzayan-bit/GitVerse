import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PlanetNode } from './SolarSystemTypes';
import { OrbitMechanics } from './OrbitMechanics';
import { useSolarSystemManager } from './SolarSystemManager';
import { Planet } from '@/planets/Planet';

export interface OrbitingPlanetProps {
  node: PlanetNode;
}

export function OrbitingPlanet({ node }: OrbitingPlanetProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planetRotationRef = useRef<THREE.Group>(null);
  const simulationSpeed = useSolarSystemManager((s) => s.simulationSpeed);

  // We use a ref to accumulate time independently so we can easily scale speed
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Accumulate time based on simulation speed
    timeRef.current += delta * simulationSpeed;

    // Update Orbit Position
    const position = OrbitMechanics.getPositionAtTime(
      node.orbit,
      timeRef.current
    );
    groupRef.current.position.copy(position);

    // Update Planet Rotation
    if (planetRotationRef.current) {
      planetRotationRef.current.rotation.y +=
        delta * simulationSpeed * node.orbit.rotationSpeed;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Apply tilt to the rotation group */}
      <group rotation={[0, 0, node.orbit.rotationTilt]}>
        <group ref={planetRotationRef}>
          <Planet config={node.planet} lodLevel="high" autoRotate={false} />
        </group>
      </group>
    </group>
  );
}
