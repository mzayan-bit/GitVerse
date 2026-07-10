'use client';

import { useSceneStore } from '@/store/scene-store';
import { STAR_DENSITY_CONFIGS } from '@/constants/stars';
import { StarField } from './StarField';
import { StarLayer } from '@/types/stars';

/**
 * Orchestrates all procedural starfield layers to create multi-layer space depth.
 */
export function StarManager() {
  // Pull density setting from store (can be dynamically altered by UI in the future)
  const performanceTier = useSceneStore((s) => s.performanceTier);

  // Map performance tier to star density
  const densityMap = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    ultra: 'ultra',
  } as const;

  const activeDensity = densityMap[performanceTier] || 'ultra';
  const activeConfig = STAR_DENSITY_CONFIGS[activeDensity];

  const layers = [
    {
      type: StarLayer.DeepSpace,
      data: activeConfig.layers[StarLayer.DeepSpace],
    },
    { type: StarLayer.Far, data: activeConfig.layers[StarLayer.Far] },
    { type: StarLayer.Medium, data: activeConfig.layers[StarLayer.Medium] },
    { type: StarLayer.Near, data: activeConfig.layers[StarLayer.Near] },
  ];

  return (
    <group name="StarfieldManager">
      {layers.map(({ type, data }) => (
        <StarField
          key={`${type}-${activeDensity}`} // Re-render entirely if density changes for fresh geometry
          config={data}
          colorTemperatureRange={activeConfig.colorTemperatureRange}
          twinkleFactor={activeConfig.twinkleFactor}
        />
      ))}
    </group>
  );
}
