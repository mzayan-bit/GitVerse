'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRepositoryScene } from './SceneManager';
import { useEntityManager } from '@/entities/EntityManager';
import { MappedVisualProperties } from '@/mapping/MappingEngine';
import { useUniverseManager } from '@/universe';

/**
 * Handles cinematic camera transition when entering/leaving a repository.
 * Interpolates camera from universe position → planet surface → city view.
 */
export function SceneTransition() {
  const { camera } = useThree();
  const {
    mode,
    activeRepositoryEntityId,
    transitionProgress,
    setTransitionProgress,
    setMode,
    config,
  } = useRepositoryScene();

  const { entities } = useEntityManager();

  const startPosition = useRef(new THREE.Vector3());
  const startLookAt = useRef(new THREE.Vector3());
  const hasCapture = useRef(false);
  const currentLookAt = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (mode === 'idle' || mode === 'exploring') {
      hasCapture.current = false;
      return;
    }

    // Capture the starting camera position once
    if (!hasCapture.current) {
      startPosition.current.copy(camera.position);
      startLookAt.current.copy(currentLookAt.current);
      hasCapture.current = true;
    }

    const speed = 1.0 / config.transitionDuration;
    const newProgress = Math.min(transitionProgress + delta * speed, 1.0);
    setTransitionProgress(newProgress);

    // Ease-in-out cubic
    const t =
      newProgress < 0.5
        ? 4 * newProgress * newProgress * newProgress
        : 1 - Math.pow(-2 * newProgress + 2, 3) / 2;

    if (mode === 'entering' && activeRepositoryEntityId) {
      const entity = entities[activeRepositoryEntityId];
      if (!entity?.transform?.position) return;

      const [ex, ey, ez] = entity.transform.position;
      const entityPos = new THREE.Vector3(ex, ey, ez);

      // Determine planet radius from visuals
      const visuals = entity.metadata?.visuals as
        MappedVisualProperties | undefined;
      const planetRadius = (visuals?.size || 2.0) * 10;

      // Target: just above the planet surface
      const targetPos = new THREE.Vector3(
        ex,
        ey + planetRadius * 2.5,
        ez + planetRadius * 1.5
      );
      const targetLookAt = entityPos.clone();

      // Interpolate
      camera.position.lerpVectors(startPosition.current, targetPos, t);
      currentLookAt.current.lerpVectors(startLookAt.current, targetLookAt, t);
      camera.lookAt(currentLookAt.current);

      if (newProgress >= 1.0) {
        setMode('exploring');
        hasCapture.current = false;
      }
    }

    if (mode === 'leaving') {
      // Fly back out to the universe overview
      const targetPos = new THREE.Vector3(0, 4000, 8000);
      const targetLookAt = new THREE.Vector3(0, 0, 0);

      camera.position.lerpVectors(startPosition.current, targetPos, t);
      currentLookAt.current.lerpVectors(startLookAt.current, targetLookAt, t);
      camera.lookAt(currentLookAt.current);

      if (newProgress >= 1.0) {
        // Reset state completely
        useRepositoryScene.setState({
          mode: 'idle',
          activeRepository: null,
          activeRepositoryEntityId: null,
          transitionProgress: 0,
        });
        // Return universe camera to free mode
        useUniverseManager.getState().setCameraState({ mode: 'free' });
        hasCapture.current = false;
      }
    }
  });

  return null;
}
