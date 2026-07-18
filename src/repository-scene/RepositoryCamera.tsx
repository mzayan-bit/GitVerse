'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRepositoryScene } from './SceneManager';
import { CityLayout, District } from './terrain/TerrainTypes';

interface RepositoryCameraProps {
  layout: CityLayout;
}

/**
 * Camera controller for exploring the repository city.
 * Supports orbit, first-person, free, directory-focus, and building-focus modes.
 * Only active when the repository scene is in 'exploring' mode.
 */
export function RepositoryCamera({ layout }: RepositoryCameraProps) {
  const { camera } = useThree();
  const { mode, cameraMode, currentPath, selectedBuilding } =
    useRepositoryScene();

  const targetPosition = useRef(new THREE.Vector3(0, 80, 150));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const orbitAngle = useRef(0);

  useFrame((_, delta) => {
    if (mode !== 'exploring') return;

    orbitAngle.current += delta * 0.1;

    switch (cameraMode) {
      case 'orbit': {
        // Orbit around the entire city
        const radius = layout.groundRadius * 0.8;
        const height = layout.groundRadius * 0.5;
        targetPosition.current.set(
          Math.cos(orbitAngle.current) * radius,
          height,
          Math.sin(orbitAngle.current) * radius
        );
        targetLookAt.current.set(0, 0, 0);
        break;
      }

      case 'free': {
        // In free mode, camera stays where it is — user controls via OrbitControls
        // We just ensure lookAt is smooth
        return;
      }

      case 'first-person': {
        // Low camera, looking forward
        const fpRadius = layout.groundRadius * 0.3;
        targetPosition.current.set(
          Math.cos(orbitAngle.current) * fpRadius,
          8,
          Math.sin(orbitAngle.current) * fpRadius
        );
        const lookAhead = orbitAngle.current + 0.5;
        targetLookAt.current.set(
          Math.cos(lookAhead) * fpRadius * 0.5,
          5,
          Math.sin(lookAhead) * fpRadius * 0.5
        );
        break;
      }

      case 'directory-focus': {
        // Focus on a specific district
        const district = findDistrictForPath(layout, currentPath.fullPath);
        if (district) {
          const [dx, dy, dz] = district.position;
          targetPosition.current.set(
            dx + district.radius * 1.5,
            district.radius * 1.2 + 20,
            dz + district.radius * 1.5
          );
          targetLookAt.current.set(dx, dy, dz);
        }
        break;
      }

      case 'building-focus': {
        // Focus on a selected building
        if (selectedBuilding) {
          const building = layout.allBuildings.find(
            (b) => b.id === selectedBuilding.id
          );
          if (building) {
            const [bx, by, bz] = building.position;
            targetPosition.current.set(
              bx + building.width * 4,
              by + building.height * 0.8,
              bz + building.depth * 4
            );
            targetLookAt.current.set(bx, by, bz);
          }
        }
        break;
      }
    }

    // Smooth interpolation
    camera.position.lerp(targetPosition.current, delta * 3.0);
    currentLookAt.current.lerp(targetLookAt.current, delta * 4.0);
    camera.lookAt(currentLookAt.current);
  });

  return null;
}

function findDistrictForPath(
  layout: CityLayout,
  path: string
): District | null {
  if (!path) return null;
  const topDir = path.split('/')[0];
  return (
    layout.districts.find((d) => d.name === topDir || d.path === topDir) || null
  );
}
