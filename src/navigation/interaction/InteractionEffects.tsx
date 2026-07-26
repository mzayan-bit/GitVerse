import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useInteractionStore } from './InteractionStore';

/**
 * InteractionEffects — A headless R3F component that drives animated
 * visual feedback for hover and selection states:
 * - Selection pulse (sin-wave emissive intensity)
 * - Hover glow (smooth ramp up/down)
 */
export function InteractionEffects() {
  const phaseRef = useRef(0);

  useFrame((state, delta) => {
    // Advance the global pulse phase
    phaseRef.current += delta * 3.0;

    const hovered = useInteractionStore.getState().hoveredTarget;
    const selected = useInteractionStore.getState().selectedTargets;

    // Iterate over scene objects and apply visual effects
    state.scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;

      const mat = obj.material as THREE.MeshStandardMaterial;
      if (!mat || !('emissive' in mat)) return;

      const userData = obj.parent?.userData as
        { entityId?: string } | undefined;
      const entityId = userData?.entityId;
      if (!entityId) return;

      const isHovered = hovered?.entityId === entityId;
      const isSelected = selected.includes(entityId);

      if (isSelected) {
        // Pulsing selection glow
        const pulse = 0.15 + Math.sin(phaseRef.current) * 0.15;
        mat.emissiveIntensity = pulse;
        mat.emissive.set('#6366f1'); // Indigo selection glow
      } else if (isHovered) {
        // Smooth hover glow
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          0.2,
          delta * 8
        );
        mat.emissive.set('#a5b4fc'); // Lighter indigo hover
      } else {
        // Decay back to no glow
        mat.emissiveIntensity = THREE.MathUtils.lerp(
          mat.emissiveIntensity,
          0,
          delta * 5
        );
      }
    });
  });

  return null;
}
