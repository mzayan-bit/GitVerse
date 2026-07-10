'use client';

import { useSceneStore } from '@/store/scene-store';
import { NEBULA_DENSITY_CONFIGS } from '@/constants/nebula';
import { NebulaLayer } from './NebulaLayer';

/**
 * Orchestrates volumetric nebula layers for the deep space cinematic feel.
 */
export function NebulaManager() {
  const performanceTier = useSceneStore((s) => s.performanceTier);
  const activeConfig =
    NEBULA_DENSITY_CONFIGS[performanceTier] || NEBULA_DENSITY_CONFIGS['ultra'];

  return (
    <group name="NebulaManager">
      <NebulaLayer
        key={`back-${performanceTier}`}
        config={activeConfig.layers.back}
      />
      <NebulaLayer
        key={`middle-${performanceTier}`}
        config={activeConfig.layers.middle}
      />
      <NebulaLayer
        key={`front-${performanceTier}`}
        config={activeConfig.layers.front}
      />
    </group>
  );
}
