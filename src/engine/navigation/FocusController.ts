import * as THREE from 'three';

export interface FocusTargetOptions {
  entityPosition: THREE.Vector3;
  boundingRadius?: number;
  viewAngle?: THREE.Vector3;
  paddingFactor?: number;
}

export class FocusController {
  /**
   * Calculates ideal camera position & target for a selected 3D node/entity.
   */
  static calculateFramedTarget(options: FocusTargetOptions): {
    goalPosition: THREE.Vector3;
    goalTarget: THREE.Vector3;
  } {
    const {
      entityPosition,
      boundingRadius = 20,
      viewAngle = new THREE.Vector3(0.5, 0.4, 0.8).normalize(),
      paddingFactor = 2.5,
    } = options;

    const frameDistance = Math.max(boundingRadius * paddingFactor, 30);
    const offset = viewAngle.clone().multiplyScalar(frameDistance);
    const goalPosition = entityPosition.clone().add(offset);
    const goalTarget = entityPosition.clone();

    return { goalPosition, goalTarget };
  }

  /**
   * Generates cubic bezier ease-in-out progress for smooth transitions.
   */
  static cubicEaseInOut(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
}
