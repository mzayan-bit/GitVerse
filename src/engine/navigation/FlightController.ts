import * as THREE from 'three';
import { MovementPresetConfig } from './MovementPresets';

export class FlightController {
  public updateFlight(
    position: THREE.Vector3,
    target: THREE.Vector3,
    movementInput: THREE.Vector3,
    pointerDelta: THREE.Vector2,
    preset: MovementPresetConfig,
    delta: number
  ): { nextPosition: THREE.Vector3; nextTarget: THREE.Vector3 } {
    // 1. Calculate direction vector from current position to target
    const forward = target.clone().sub(position).normalize();
    const right = new THREE.Vector3()
      .crossVectors(forward, new THREE.Vector3(0, 1, 0))
      .normalize();
    const up = new THREE.Vector3().crossVectors(right, forward).normalize();

    // 2. Process mouse/trackpad pointer delta into pitch and yaw
    const yawDelta = -pointerDelta.x * preset.mouseSensitivity;
    const pitchDelta = -pointerDelta.y * preset.mouseSensitivity;

    // Apply rotation around current camera axes
    const yawQuat = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      yawDelta
    );
    const pitchQuat = new THREE.Quaternion().setFromAxisAngle(
      right,
      pitchDelta
    );

    const rotation = new THREE.Quaternion().multiplyQuaternions(
      yawQuat,
      pitchQuat
    );
    forward.applyQuaternion(rotation).normalize();

    // 3. Compute spatial movement based on WASD/QE input relative to camera orientation
    const moveWorld = new THREE.Vector3();
    moveWorld.add(forward.clone().multiplyScalar(-movementInput.z)); // Z is forward/backward
    moveWorld.add(right.clone().multiplyScalar(movementInput.x)); // X is strafe left/right
    moveWorld.add(up.clone().multiplyScalar(movementInput.y)); // Y is climb/descend

    const velocityStep = moveWorld.multiplyScalar(preset.acceleration * delta);
    const nextPosition = position.clone().add(velocityStep);
    const nextTarget = nextPosition
      .clone()
      .add(forward.clone().multiplyScalar(100));

    return { nextPosition, nextTarget };
  }
}
