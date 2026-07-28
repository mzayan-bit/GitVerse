import { MovementController } from '@/engine/navigation/MovementController';
import * as THREE from 'three';

export class NavigationAgent {
  /**
   * Fly camera to target 3D position & look at target
   */
  public static flyTo(
    position: [number, number, number],
    target: [number, number, number] = [0, 0, 0]
  ): void {
    const controller = MovementController.getInstance();
    controller.flyToTarget({
      entityPosition: new THREE.Vector3(...target),
      paddingFactor: 2.2,
    });
  }
}
