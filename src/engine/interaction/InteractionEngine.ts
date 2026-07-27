import * as THREE from 'three';
import {
  useInteractionStore,
  InteractionTarget,
} from '@/navigation/interaction/InteractionStore';
import { MovementController } from '../navigation/MovementController';
import { RaycastPicker } from './RaycastPicker';

export class InteractionEngine {
  private static instance: InteractionEngine | null = null;

  private picker = new RaycastPicker();
  private clickHoldTimer: number | null = null;
  private holdThresholdMs = 400;
  private isHolding = false;

  public static getInstance(): InteractionEngine {
    if (!InteractionEngine.instance) {
      InteractionEngine.instance = new InteractionEngine();
    }
    return InteractionEngine.instance;
  }

  public handlePointerDown(
    event: PointerEvent,
    domElement: HTMLElement,
    camera: THREE.Camera,
    scene: THREE.Scene
  ): void {
    if (event.button !== 0) return; // Only primary click for hold

    this.isHolding = false;
    const pickResult = this.picker.pick(
      event,
      domElement,
      camera,
      scene.children
    );

    if (pickResult) {
      this.clickHoldTimer = window.setTimeout(() => {
        this.isHolding = true;
        // Trigger quick focus on hold
        MovementController.getInstance().flyToTarget({
          entityPosition: pickResult.object.position,
        });
      }, this.holdThresholdMs);
    }
  }

  public handlePointerUp(
    event: PointerEvent,
    domElement: HTMLElement,
    camera: THREE.Camera,
    scene: THREE.Scene
  ): void {
    if (this.clickHoldTimer !== null) {
      clearTimeout(this.clickHoldTimer);
      this.clickHoldTimer = null;
    }

    if (this.isHolding) return;

    if (event.button === 0) {
      const pickResult = this.picker.pick(
        event,
        domElement,
        camera,
        scene.children
      );
      const store = useInteractionStore.getState();

      if (pickResult) {
        if (event.shiftKey) {
          // Multi-select toggle
          if (store.selectedTargets.includes(pickResult.entityId)) {
            store.deselectTarget(pickResult.entityId);
          } else {
            store.selectTarget(pickResult.entityId);
          }
        } else {
          // Single select
          store.clearSelection();
          store.selectTarget(pickResult.entityId);
          store.pushBreadcrumb(pickResult.entityId, pickResult.entityId);
        }
      } else if (!event.shiftKey) {
        store.clearSelection();
      }
    }
  }

  public handleContextMenu(
    event: MouseEvent,
    domElement: HTMLElement,
    camera: THREE.Camera,
    scene: THREE.Scene
  ): void {
    event.preventDefault();

    const pickResult = this.picker.pick(
      event,
      domElement,
      camera,
      scene.children
    );
    const store = useInteractionStore.getState();

    if (pickResult) {
      const target: InteractionTarget = {
        entityId: pickResult.entityId,
        entityType: pickResult.entityType,
        distance: pickResult.distance,
        point: [pickResult.point.x, pickResult.point.y, pickResult.point.z],
      };
      store.setContextMenu(target);
    } else {
      store.setContextMenu(null);
    }
  }
}
