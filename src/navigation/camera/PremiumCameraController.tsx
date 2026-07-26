import { useRef, useCallback } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useCameraRig } from './CameraRig';
import { useRepositoryScene } from '@/repository-scene/SceneManager';

/**
 * PremiumCameraController — Replaces the basic NavigationCamera with a
 * physics-driven, momentum-based camera system that feels cinematic.
 *
 * Key features:
 * - Exponential smoothing (not linear lerp) for buttery transitions
 * - Momentum-based movement with configurable damping
 * - Smooth focus transitions with ease-in-out curves
 * - Seamless mode switching (orbit ↔ fly ↔ explore ↔ focus)
 */
export function PremiumCameraController() {
  const { camera } = useThree();
  const repoSceneMode = useRepositoryScene((s) => s.mode);

  // Refs for per-frame mutable state (avoids Zustand subscription overhead)
  const currentPos = useRef(new THREE.Vector3(0, 400, 800));
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0));
  const smoothVelocity = useRef(new THREE.Vector3());

  useFrame((_, rawDelta) => {
    // Yield when repository scene is active
    if (repoSceneMode !== 'idle') return;

    // Clamp delta to avoid huge jumps on tab-switch
    const delta = Math.min(rawDelta, 0.05);

    const state = useCameraRig.getState();

    // ── 1. Apply Momentum (Fly / Explore modes) ─────────────────────
    if (
      state.mode === 'fly' ||
      state.mode === 'explore' ||
      state.mode === 'firstPerson'
    ) {
      const momentum = state.momentum;

      if (momentum.lengthSq() > 0.001) {
        // Move the goal position by momentum
        const forward = new THREE.Vector3();
        camera.getWorldDirection(forward);
        const right = new THREE.Vector3()
          .crossVectors(forward, camera.up)
          .normalize();
        const up = camera.up.clone();

        const worldImpulse = new THREE.Vector3()
          .addScaledVector(right, momentum.x * delta)
          .addScaledVector(up, momentum.y * delta)
          .addScaledVector(forward, momentum.z * delta);

        state.goalPosition.add(worldImpulse);
        state.goalTarget.add(worldImpulse);

        // Apply damping
        momentum.multiplyScalar(state.damping);
        if (momentum.lengthSq() < 0.01) {
          momentum.set(0, 0, 0);
        }
      }
    }

    // ── 2. Smooth Interpolation ─────────────────────────────────────
    // Use exponential smoothing: smoother than lerp, no fixed steps
    const posSmooth = 1 - Math.pow(0.001, delta * 3.0); // ~3Hz cutoff
    const targetSmooth = 1 - Math.pow(0.001, delta * 4.0); // Slightly faster target tracking

    currentPos.current.lerp(state.goalPosition, posSmooth);
    currentTarget.current.lerp(state.goalTarget, targetSmooth);

    // ── 3. Apply to Camera ──────────────────────────────────────────
    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);

    // ── 4. Update store position (for UI/bookmarks) ─────────────────
    state.position.copy(currentPos.current);
    state.target.copy(currentTarget.current);

    // ── 5. Transition tracking ──────────────────────────────────────
    if (state.isTransitioning) {
      const dist = currentPos.current.distanceTo(state.goalPosition);
      if (dist < 0.5) {
        useCameraRig.setState({
          isTransitioning: false,
          transitionProgress: 1,
        });
      } else {
        const progress =
          1 -
          dist / Math.max(1, state.goalPosition.distanceTo(currentPos.current));
        useCameraRig.setState({ transitionProgress: Math.min(progress, 1) });
      }
    }
  });

  return null;
}
