import * as THREE from 'three';

export class OptimizedRaycaster {
  private raycaster = new THREE.Raycaster();
  private lastRaycastTime = 0;
  private throttleMs = 32; // ~30fps raycasting throttle to keep frame rate high

  public shouldRaycast(now: number): boolean {
    if (now - this.lastRaycastTime >= this.throttleMs) {
      this.lastRaycastTime = now;
      return true;
    }
    return false;
  }

  public raycastObjects(
    origin: THREE.Vector3,
    direction: THREE.Vector3,
    objects: THREE.Object3D[]
  ): THREE.Intersection[] {
    this.raycaster.set(origin, direction);
    return this.raycaster.intersectObjects(objects, true);
  }
}
