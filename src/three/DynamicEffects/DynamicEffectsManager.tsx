'use client';

import { useSceneStore } from '@/store/scene-store';
import { ShootingStars } from './ShootingStars';
import { SpaceDust } from './SpaceDust';

export function DynamicEffectsManager() {
  const performanceTier = useSceneStore((s) => s.performanceTier);

  // We can disable dynamic effects completely on low settings to save FPS
  if (performanceTier === 'low') {
    return null;
  }

  return (
    <group name="DynamicEffects">
      <ShootingStars />
      <SpaceDust />
    </group>
  );
}
