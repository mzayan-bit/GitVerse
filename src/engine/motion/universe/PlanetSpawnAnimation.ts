import * as THREE from 'three';
import { MotionEngine } from '../MotionEngine';
import { SPRING_PRESETS } from '../MotionConfig';

export class PlanetSpawnAnimation {
  /**
   * Applies a spring scale spawn animation to a planet mesh.
   */
  static animateSpawn(
    id: string,
    mesh: THREE.Object3D,
    targetScale: number = 1.0,
    onComplete?: () => void
  ): void {
    mesh.scale.set(0.001, 0.001, 0.001);

    MotionEngine.getInstance().animations.animateVector3(
      `spawn-${id}`,
      new THREE.Vector3(0.001, 0.001, 0.001),
      new THREE.Vector3(targetScale, targetScale, targetScale),
      (scaleVec) => {
        mesh.scale.copy(scaleVec);
      },
      SPRING_PRESETS.elastic
    );

    if (onComplete) {
      setTimeout(onComplete, 600);
    }
  }

  /**
   * Applies a dissolve scale animation before deletion.
   */
  static animateDissolve(
    id: string,
    mesh: THREE.Object3D,
    onComplete?: () => void
  ): void {
    MotionEngine.getInstance().animations.animateVector3(
      `dissolve-${id}`,
      mesh.scale.clone(),
      new THREE.Vector3(0.001, 0.001, 0.001),
      (scaleVec) => {
        mesh.scale.copy(scaleVec);
      },
      SPRING_PRESETS.snappy
    );

    if (onComplete) {
      setTimeout(onComplete, 300);
    }
  }
}
