import * as THREE from 'three';
import { SpringPhysics } from './SpringPhysics';
import { SPRING_PRESETS, SpringConfig } from './MotionConfig';

export class AnimationManager {
  private activeSprings: Array<{
    id: string;
    currentVec: THREE.Vector3;
    targetVec: THREE.Vector3;
    velocityVec: THREE.Vector3;
    config: SpringConfig;
    onUpdate: (v: THREE.Vector3) => void;
  }> = [];

  public animateVector3(
    id: string,
    start: THREE.Vector3,
    target: THREE.Vector3,
    onUpdate: (v: THREE.Vector3) => void,
    config: SpringConfig = SPRING_PRESETS.snappy
  ): void {
    this.activeSprings = this.activeSprings.filter((s) => s.id !== id);
    this.activeSprings.push({
      id,
      currentVec: start.clone(),
      targetVec: target.clone(),
      velocityVec: new THREE.Vector3(),
      config,
      onUpdate,
    });
  }

  public update(delta: number): void {
    const remaining = [];

    for (const spring of this.activeSprings) {
      const stepX = SpringPhysics.step(
        {
          current: spring.currentVec.x,
          target: spring.targetVec.x,
          velocity: spring.velocityVec.x,
        },
        spring.config,
        delta
      );
      const stepY = SpringPhysics.step(
        {
          current: spring.currentVec.y,
          target: spring.targetVec.y,
          velocity: spring.velocityVec.y,
        },
        spring.config,
        delta
      );
      const stepZ = SpringPhysics.step(
        {
          current: spring.currentVec.z,
          target: spring.targetVec.z,
          velocity: spring.velocityVec.z,
        },
        spring.config,
        delta
      );

      spring.currentVec.set(stepX.current, stepY.current, stepZ.current);
      spring.velocityVec.set(stepX.velocity, stepY.velocity, stepZ.velocity);

      spring.onUpdate(spring.currentVec);

      if (!stepX.isAtRest || !stepY.isAtRest || !stepZ.isAtRest) {
        remaining.push(spring);
      }
    }

    this.activeSprings = remaining;
  }
}
