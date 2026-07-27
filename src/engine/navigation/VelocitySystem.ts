import * as THREE from 'three';

export class VelocitySystem {
  public linearVelocity: THREE.Vector3 = new THREE.Vector3();
  public angularVelocity: THREE.Vector2 = new THREE.Vector2(); // Pitch & Yaw
  public acceleration: THREE.Vector3 = new THREE.Vector3();
  public maxSpeed: number = 500;
  public damping: number = 0.92;

  public reset(): void {
    this.linearVelocity.set(0, 0, 0);
    this.angularVelocity.set(0, 0);
    this.acceleration.set(0, 0, 0);
  }

  public addImpulse(impulse: THREE.Vector3): void {
    this.linearVelocity.add(impulse);
    if (this.linearVelocity.length() > this.maxSpeed) {
      this.linearVelocity.normalize().multiplyScalar(this.maxSpeed);
    }
  }

  public addRotationalImpulse(pitch: number, yaw: number): void {
    this.angularVelocity.x += pitch;
    this.angularVelocity.y += yaw;
  }

  public update(delta: number): {
    linearDelta: THREE.Vector3;
    angularDelta: THREE.Vector2;
  } {
    // Integrate linear velocity
    const linearDelta = this.linearVelocity.clone().multiplyScalar(delta);

    // Integrate angular velocity
    const angularDelta = this.angularVelocity.clone().multiplyScalar(delta);

    // Apply framerate-independent exponential damping
    const dampFactor = Math.pow(this.damping, delta * 60);
    this.linearVelocity.multiplyScalar(dampFactor);
    this.angularVelocity.multiplyScalar(dampFactor);

    // Deadzone zeroing
    if (this.linearVelocity.lengthSq() < 0.00001) {
      this.linearVelocity.set(0, 0, 0);
    }
    if (this.angularVelocity.lengthSq() < 0.00001) {
      this.angularVelocity.set(0, 0);
    }

    return { linearDelta, angularDelta };
  }
}
