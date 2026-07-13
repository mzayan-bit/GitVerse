import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarSystemManager } from '@/systems/SolarSystem/SolarSystemManager';
import { OrbitMechanics } from '@/systems/SolarSystem/OrbitMechanics';

export function NavigationCamera() {
  const { camera } = useThree();
  const focusedPlanetId = useSolarSystemManager((s) => s.focusedPlanetId);
  const systemConfig = useSolarSystemManager((s) => s.systemConfig);
  const simulationSpeed = useSolarSystemManager((s) => s.simulationSpeed);
  const cameraMode = useSolarSystemManager((s) => s.cameraMode);

  // Target values for interpolation
  const targetPosition = useRef(new THREE.Vector3(0, 100, 300));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // Current values to smoothly interpolate from
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  // A standalone time tracker, since we need to know the planet's exact position
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta * simulationSpeed;

    if (cameraMode === 'orbit') return; // Let SceneOrbitControls handle it

    if (cameraMode === 'follow' && focusedPlanetId && systemConfig) {
      const node = systemConfig.planets.find((p) => p.id === focusedPlanetId);
      if (node) {
        // Calculate where the planet is right now
        const planetPos = OrbitMechanics.getPositionAtTime(
          node.orbit,
          timeRef.current
        );

        // We want to look at the planet
        targetLookAt.current.copy(planetPos);

        // We want the camera to be slightly above and behind the planet
        // To do this simply, we offset by radius * some factor
        const offset = new THREE.Vector3(
          node.planet.terrain.baseRadius * 3,
          node.planet.terrain.baseRadius * 2,
          node.planet.terrain.baseRadius * 3
        );
        targetPosition.current.copy(planetPos).add(offset);
      }
    } else {
      // Free / Home mode
      targetLookAt.current.set(0, 0, 0);
      targetPosition.current.set(0, 80, 250); // Cinematic close-up overview
    }

    // Smooth Interpolation
    // LERP Position
    camera.position.lerp(targetPosition.current, delta * 3.0);

    // LERP LookAt via dummy object or simple vector lerp
    currentLookAt.current.lerp(targetLookAt.current, delta * 4.0);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
