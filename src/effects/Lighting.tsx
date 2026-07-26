'use client';

import { useThemeManager } from '@/rendering/themes/ThemeManager';

/**
 * Scene lighting configuration for cinematic universe, driven by ThemeManager.
 */
function Lighting() {
  const theme = useThemeManager((s) => s.activeTheme);
  const { ambient, directional, rim, core, intensityMultiplier } =
    theme.lighting;

  return (
    <group name="CinematicLighting">
      {/* Ambient Fill */}
      <ambientLight intensity={0.4 * intensityMultiplier} color={ambient} />

      {/* Main Directional Light (Sun/Star) */}
      <directionalLight
        position={[100, 200, 50]}
        intensity={1.0 * intensityMultiplier}
        color={directional}
      />

      {/* Cinematic Rim Light (Cool tone from behind) */}
      <spotLight
        position={[-100, 50, -200]}
        intensity={2.5 * intensityMultiplier}
        color={rim}
        angle={Math.PI / 4}
        penumbra={1}
        distance={800}
      />

      {/* Galactic Core Warmth (From below) */}
      <pointLight
        position={[0, -100, 0]}
        intensity={1.5 * intensityMultiplier}
        color={core}
        distance={1000}
        decay={2}
      />
    </group>
  );
}

export { Lighting };
