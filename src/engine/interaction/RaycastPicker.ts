import * as THREE from 'three';

export interface PickResult {
  object: THREE.Object3D;
  entityId: string;
  entityType: string;
  point: THREE.Vector3;
  distance: number;
}

export class RaycastPicker {
  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  constructor() {
    // Set precision parameters
    this.raycaster.params.Points = { threshold: 5 };
    this.raycaster.params.Line = { threshold: 3 };
  }

  /**
   * Casts a ray from camera through normalized device coordinates (NDC) mouse position.
   */
  public pick(
    event: MouseEvent | PointerEvent,
    domElement: HTMLElement,
    camera: THREE.Camera,
    sceneObjects: THREE.Object3D[]
  ): PickResult | null {
    const rect = domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, camera);
    const intersects = this.raycaster.intersectObjects(sceneObjects, true);

    for (const hit of intersects) {
      let current: THREE.Object3D | null = hit.object;
      while (current) {
        if (current.userData && current.userData.entityId) {
          return {
            object: current,
            entityId: current.userData.entityId,
            entityType: current.userData.entityType || 'repository',
            point: hit.point,
            distance: hit.distance,
          };
        }
        current = current.parent;
      }
    }

    return null;
  }
}
