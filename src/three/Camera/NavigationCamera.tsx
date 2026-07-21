import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useSolarSystemManager } from '@/systems/SolarSystem/SolarSystemManager';
import { OrbitMechanics } from '@/systems/SolarSystem/OrbitMechanics';
import { useGalaxyManager } from '@/galaxy/GalaxyManager';
import { useUniverseManager } from '@/universe';
import { useEntityManager } from '@/entities/EntityManager';
import { MappedVisualProperties } from '@/mapping/MappingEngine';
import { useRepositoryScene } from '@/repository-scene';

export function NavigationCamera() {
  const { camera } = useThree();
  const focusedPlanetId = useSolarSystemManager((s) => s.focusedPlanetId);
  const systemConfig = useSolarSystemManager((s) => s.systemConfig);
  const simulationSpeed = useSolarSystemManager((s) => s.simulationSpeed);

  // Use Galaxy Manager for macro state
  const { cameraMode, focusedSystemId, galaxyConfig } = useGalaxyManager();

  // Target values for interpolation
  const targetPosition = useRef(new THREE.Vector3(0, 4000, 8000));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const { isBuilt, cameraState: universeCameraState } = useUniverseManager();
  const { entities } = useEntityManager();

  // Repository scene awareness
  const repoSceneMode = useRepositoryScene((s) => s.mode);

  // Current values to smoothly interpolate from
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

  const timeRef = useRef(0);

  useFrame((_, delta) => {
    // Yield control when repository scene is active (entering, exploring, or leaving)
    if (repoSceneMode !== 'idle') return;

    timeRef.current += delta * simulationSpeed;

    // --- LIVE UNIVERSE NAVIGATION ---
    if (isBuilt) {
      if (universeCameraState.mode === 'free') {
        targetLookAt.current.set(0, 0, 0);
        targetPosition.current.set(0, 400, 800); // Macro view closer
      } else if (
        universeCameraState.mode === 'focus' &&
        universeCameraState.targetId
      ) {
        const entity = entities[universeCameraState.targetId];
        if (entity && entity.transform?.position) {
          const [ex, ey, ez] = entity.transform.position;
          const entityPos = new THREE.Vector3(ex, ey, ez);

          targetLookAt.current.copy(entityPos);

          // Determine offset based on entity type
          let offsetDist = 50;
          if (entity.type === 'planet') {
            const r = entity.metadata?.visuals
              ? (entity.metadata.visuals as MappedVisualProperties).size
              : 2;
            offsetDist = r * 3;
          } else if (entity.type === 'solar_system') {
            offsetDist = 300;
          } else if (entity.type === 'galaxy') {
            offsetDist = 2000;
          }

          targetPosition.current
            .copy(entityPos)
            .add(new THREE.Vector3(offsetDist, offsetDist * 0.8, offsetDist));
        }
      }

      // Smooth Interpolation
      camera.position.lerp(targetPosition.current, delta * 2.5);
      currentLookAt.current.lerp(targetLookAt.current, delta * 3.5);
      camera.lookAt(currentLookAt.current);
      return;
    }

    // --- PROCEDURAL DEMO NAVIGATION ---
    const basePosition = new THREE.Vector3(0, 0, 0);
    let isFollowingPlanet = false;

    // 1. Determine the base coordinates of the focused Solar System
    if (focusedSystemId && galaxyConfig) {
      const sysNode = galaxyConfig.systems.find(
        (s) => s.id === focusedSystemId
      );
      if (sysNode) {
        basePosition.set(
          sysNode.position[0],
          sysNode.position[1],
          sysNode.position[2]
        );
      }
    }

    // 2. Determine camera targets based on hierarchical mode
    if (cameraMode === 'galaxy-free') {
      targetLookAt.current.set(0, 0, 0);
      targetPosition.current.set(0, 4000, 8000); // Macro view
    } else if (
      cameraMode === 'galaxy-follow' ||
      cameraMode === 'solar-system-free'
    ) {
      // Zoomed into a specific star system
      targetLookAt.current.copy(basePosition);
      // Positioned slightly above and away from the star
      targetPosition.current
        .copy(basePosition)
        .add(new THREE.Vector3(0, 80, 250));
    } else if (
      cameraMode === 'planet-follow' &&
      focusedPlanetId &&
      systemConfig
    ) {
      const node = systemConfig.planets.find((p) => p.id === focusedPlanetId);
      if (node) {
        isFollowingPlanet = true;
        const planetPos = OrbitMechanics.getPositionAtTime(
          node.orbit,
          timeRef.current
        );

        // Planet position is relative to the solar system's base position
        const absolutePlanetPos = planetPos.clone().add(basePosition);

        targetLookAt.current.copy(absolutePlanetPos);

        const offset = new THREE.Vector3(
          node.planet.terrain.baseRadius * 3,
          node.planet.terrain.baseRadius * 2,
          node.planet.terrain.baseRadius * 3
        );
        targetPosition.current.copy(absolutePlanetPos).add(offset);
      }
    }

    // Fallback if planet-follow fails or node is missing
    if (cameraMode === 'planet-follow' && !isFollowingPlanet) {
      targetLookAt.current.copy(basePosition);
      targetPosition.current
        .copy(basePosition)
        .add(new THREE.Vector3(0, 80, 250));
    }

    // Smooth Interpolation
    camera.position.lerp(targetPosition.current, delta * 2.5);
    currentLookAt.current.lerp(targetLookAt.current, delta * 3.5);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}
