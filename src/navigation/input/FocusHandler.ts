import { useCallback } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { useCameraRig } from '../camera/CameraRig';
import { useUniverseManager } from '@/universe/UniverseManager';
import { useEntityManager } from '@/entities/EntityManager';
import { MappedVisualProperties } from '@/mapping/MappingEngine';

/**
 * FocusHandler — Manages smooth camera focus transitions.
 * Called from UniverseRenderer on click/double-click on entities.
 */
export function useFocusHandler() {
  const entities = useEntityManager((s) => s.entities);

  const focusOnEntity = useCallback(
    (entityId: string) => {
      const entity = entities[entityId];
      if (!entity?.transform?.position) return;

      const [ex, ey, ez] = entity.transform.position;
      const entityPos = new THREE.Vector3(ex, ey, ez);

      // Calculate appropriate viewing distance based on entity type
      let viewDist = 50;
      if (entity.type === 'planet') {
        const visuals = entity.metadata?.visuals as
          MappedVisualProperties | undefined;
        const r = visuals?.size ?? 2.0;
        viewDist = r * 8 * 3.5; // 3.5x planet radius for nice framing
      } else if (entity.type === 'solar_system') {
        viewDist = 350;
      } else if (entity.type === 'galaxy') {
        viewDist = 2500;
      }

      // Position camera at a pleasing angle (slightly above and to the side)
      const goalPos = entityPos
        .clone()
        .add(new THREE.Vector3(viewDist * 0.7, viewDist * 0.5, viewDist));

      const rig = useCameraRig.getState();
      rig.setGoal(goalPos, entityPos);
      rig.setMode('focus');
      rig.pushFocusHistory(entityId);
    },
    [entities]
  );

  return { focusOnEntity };
}
