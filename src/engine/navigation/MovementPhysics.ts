import * as THREE from 'three';
import { MovementPresetConfig } from './MovementPresets';

export class MovementPhysics {
  /**
   * Applies critically damped spring interpolation from current vector to target vector.
   */
  static springVector(
    current: THREE.Vector3,
    target: THREE.Vector3,
    velocity: THREE.Vector3,
    stiffness: number,
    delta: number
  ): void {
    const factor = 1 - Math.exp(-stiffness * delta);
    const deltaPos = target.clone().sub(current);
    velocity.add(deltaPos.multiplyScalar(stiffness * delta));
    velocity.multiplyScalar(Math.exp(-stiffness * delta * 0.5));
    current.add(velocity.clone().multiplyScalar(delta)).lerp(target, factor);
  }

  /**
   * Exponential smoothing for camera transitions (never abrupt, framerate independent).
   */
  static smoothStepVector(
    current: THREE.Vector3,
    target: THREE.Vector3,
    smoothness: number,
    delta: number
  ): THREE.Vector3 {
    const alpha = 1 - Math.pow(smoothness, delta * 60);
    return current.clone().lerp(target, Math.min(Math.max(alpha, 0), 1));
  }

  /**
   * Clamps position vector within min/max distance sphere from target center.
   */
  static clampDistanceSphere(
    position: THREE.Vector3,
    center: THREE.Vector3,
    minDist: number,
    maxDist: number
  ): THREE.Vector3 {
    const dir = position.clone().sub(center);
    const dist = dir.length();
    if (dist < 0.0001) {
      return center.clone().add(new THREE.Vector3(0, 0, minDist));
    }
    const clampedDist = Math.max(minDist, Math.min(maxDist, dist));
    return center.clone().add(dir.normalize().multiplyScalar(clampedDist));
  }

  /**
   * Prevents camera from colliding with planetary bodies by applying repulsive force.
   */
  static preventCollisions(
    position: THREE.Vector3,
    colliders: Array<{ position: THREE.Vector3; radius: number }>,
    minBuffer: number = 10
  ): THREE.Vector3 {
    const adjusted = position.clone();
    for (const collider of colliders) {
      const minDistance = collider.radius + minBuffer;
      const vecToCam = adjusted.clone().sub(collider.position);
      const dist = vecToCam.length();

      if (dist < minDistance && dist > 0.0001) {
        const repulsion = vecToCam.normalize().multiplyScalar(minDistance);
        adjusted.copy(collider.position.clone().add(repulsion));
      }
    }
    return adjusted;
  }

  /**
   * Computes smooth trackpad / mouse inertia decay.
   */
  static applyInertiaDamping(
    velocity: THREE.Vector3,
    preset: MovementPresetConfig,
    delta: number
  ): THREE.Vector3 {
    const dampingFactor = Math.pow(preset.damping, delta * 60);
    return velocity.multiplyScalar(dampingFactor);
  }
}
