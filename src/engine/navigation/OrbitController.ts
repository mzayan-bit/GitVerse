import * as THREE from 'three';
import { MovementPresetConfig } from './MovementPresets';

export class OrbitController {
  private spherical = new THREE.Spherical();
  private zoomVelocity = 0;
  private dampingFactor = 0.88;

  public updateOrbit(
    position: THREE.Vector3,
    target: THREE.Vector3,
    pointerDelta: THREE.Vector2,
    wheelDelta: number,
    preset: MovementPresetConfig,
    _delta: number
  ): { nextPosition: THREE.Vector3; nextTarget: THREE.Vector3 } {
    const offset = position.clone().sub(target);
    this.spherical.setFromVector3(offset);

    // Apply rotation from pointer drag
    if (pointerDelta.lengthSq() > 0) {
      this.spherical.theta -= pointerDelta.x * preset.mouseSensitivity * 1.5;
      this.spherical.phi -= pointerDelta.y * preset.mouseSensitivity * 1.5;
      this.spherical.phi = Math.max(
        0.05,
        Math.min(Math.PI - 0.05, this.spherical.phi)
      );
    }

    // Apply smooth inertia zoom from mouse wheel
    if (Math.abs(wheelDelta) > 0.01) {
      this.zoomVelocity += wheelDelta * preset.trackpadSensitivity * 0.05;
    }

    if (Math.abs(this.zoomVelocity) > 0.0001) {
      this.spherical.radius *= 1 + this.zoomVelocity;
      this.spherical.radius = Math.max(
        10,
        Math.min(5000, this.spherical.radius)
      );
      this.zoomVelocity *= this.dampingFactor;
    }

    const nextOffset = new THREE.Vector3().setFromSpherical(this.spherical);
    const nextPosition = target.clone().add(nextOffset);

    return { nextPosition, nextTarget: target.clone() };
  }

  public resetCamera(): { position: THREE.Vector3; target: THREE.Vector3 } {
    return {
      position: new THREE.Vector3(0, 400, 800),
      target: new THREE.Vector3(0, 0, 0),
    };
  }
}
