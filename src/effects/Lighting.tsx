'use client';

import { DEFAULT_LIGHTING_CONFIG, LightingConfig } from '@/constants/lighting';

interface LightingProps {
  config?: Partial<LightingConfig>;
}

/**
 * Scene lighting configuration for cinematic universe.
 */
function Lighting({ config }: LightingProps) {
  const merged = {
    ...DEFAULT_LIGHTING_CONFIG,
    ...config,
  };

  return (
    <group name="CinematicLighting">
      {/* Ambient Fill */}
      <ambientLight
        intensity={merged.ambient.intensity}
        color={merged.ambient.color}
      />

      {/* Main Directional Light (Sun/Star) */}
      <directionalLight
        position={merged.directional.position}
        intensity={merged.directional.intensity}
        color={merged.directional.color}
      />

      {/* Cinematic Rim Light (Cool tone from behind) */}
      <spotLight
        position={merged.rim.position}
        intensity={merged.rim.intensity}
        color={merged.rim.color}
        angle={Math.PI / 4}
        penumbra={1}
        distance={100}
      />

      {/* Galactic Core Warmth (From below) */}
      <pointLight
        position={merged.core.position}
        intensity={merged.core.intensity}
        color={merged.core.color}
        distance={200}
        decay={2}
      />
    </group>
  );
}

export { Lighting };
export type { LightingProps };
