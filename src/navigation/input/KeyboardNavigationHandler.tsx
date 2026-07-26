import { useEffect, useCallback, useRef } from 'react';
import * as THREE from 'three';
import { useCameraRig } from '../camera/CameraRig';

/**
 * KeyboardNavigationHandler — WASD + Q/E vertical, Shift boost, Space brake.
 * Uses continuous key tracking (not single-fire keydown) for fluid movement.
 */
export function KeyboardNavigationHandler() {
  const keysDown = useRef(new Set<string>());

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (
      (e.target as HTMLElement)?.tagName === 'INPUT' ||
      (e.target as HTMLElement)?.tagName === 'TEXTAREA'
    )
      return;
    keysDown.current.add(e.key.toLowerCase());

    // Shift boost
    if (e.shiftKey) {
      useCameraRig.getState().setSpeedMultiplier(3.0);
    }
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysDown.current.delete(e.key.toLowerCase());

    if (!e.shiftKey) {
      useCameraRig.getState().setSpeedMultiplier(1.0);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Continuous input polling at 60fps
    let rafId: number;
    const poll = () => {
      const state = useCameraRig.getState();
      const mode = state.mode;

      // Only apply keyboard movement in fly/explore/firstPerson modes
      if (mode !== 'fly' && mode !== 'explore' && mode !== 'firstPerson') {
        rafId = requestAnimationFrame(poll);
        return;
      }

      const keys = keysDown.current;
      const accel = state.acceleration * state.speedMultiplier;
      const impulse = new THREE.Vector3();

      // WASD movement
      if (keys.has('w') || keys.has('arrowup')) impulse.z += accel;
      if (keys.has('s') || keys.has('arrowdown')) impulse.z -= accel;
      if (keys.has('a') || keys.has('arrowleft')) impulse.x -= accel;
      if (keys.has('d') || keys.has('arrowright')) impulse.x += accel;

      // Q/E vertical
      if (keys.has('q')) impulse.y -= accel;
      if (keys.has('e')) impulse.y += accel;

      // Space = brake
      if (keys.has(' ')) {
        state.momentum.multiplyScalar(0.85);
      }

      if (impulse.lengthSq() > 0) {
        state.applyImpulse(impulse.multiplyScalar(0.016)); // Normalize to ~16ms
      }

      rafId = requestAnimationFrame(poll);
    };

    rafId = requestAnimationFrame(poll);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(rafId);
    };
  }, [handleKeyDown, handleKeyUp]);

  return null;
}
