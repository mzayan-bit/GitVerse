import * as THREE from 'three';
import { MovementPresetConfig } from './MovementPresets';

export class OrbitController {
  private spherical = new THREE.Spherical();

  public updateOrbit(
    position: THREE.Vector3,
    target: THREE.Vector3,
    pointerDelta: THREE.Vector2,
    wheelDelta: number,
    preset: MovementPresetConfig,
    delta: number
  ): { nextPosition: THREE.Vector3; nextTarget: THREE.Vector3 } {
    // Offset vector from target to position
    const offset = position.clone().sub(target);
    this.spherical.setFromVector3(offset);

    // Apply rotation from pointer drag
    if (pointerDelta.lengthSq() > 0) {
      this.spherical.theta -= pointerDelta.x * preset.mouseSensitivity;
      this.spherical.phi -= pointerDelta.y * preset.mouseSensitivity;

      // Clamp polar angle to avoid flipping at poles
      this.spherical.phi = Math.max(
        0.05,
        Math.min(Math.PI - 0.05, this.spherical.phi)
      );
    }

    // Apply zoom from mouse wheel / pinch trackpad
    if (Math.abs(wheelDelta) > 0.1) {
      const zoomFactor = 1 + wheelDelta * preset.trackpadSensitivity;
      this.spherical.radius *= zoomFactor;
      this.spherical.radius = Math.max(
        preset.minDistance,
        Math.min(preset.maxDistance, this.spherical.radius)
      );
    }

    // Convert back to Cartesian position
    const nextOffset = new THREE.Vector3().setFromSpherical(this.spherical);
    const nextPosition = target.clone().add(nextOffset);

    return { nextPosition, nextTarget: target.clone() };
  }
}
