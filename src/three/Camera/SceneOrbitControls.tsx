'use client';

import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControlsConfig } from '@/types/rendering';
import { DEFAULT_ORBIT_CONTROLS_CONFIG } from '@/constants/rendering';
import { useSolarSystemManager } from '@/systems/SolarSystem/SolarSystemManager';

interface SceneOrbitControlsProps {
  config?: Partial<OrbitControlsConfig>;
}

/**
 * Configurable orbit controls wrapper.
 * Must be a child of `<Canvas>`.
 */
function SceneOrbitControls({ config }: SceneOrbitControlsProps) {
  const cameraMode = useSolarSystemManager((s) => s.cameraMode);

  const merged: OrbitControlsConfig = {
    ...DEFAULT_ORBIT_CONTROLS_CONFIG,
    ...config,
  };

  if (cameraMode === 'follow') return null;

  return (
    <DreiOrbitControls
      enableDamping={merged.enableDamping}
      dampingFactor={merged.dampingFactor}
      enableZoom={merged.enableZoom}
      zoomSpeed={merged.zoomSpeed}
      enableRotate={merged.enableRotate}
      rotateSpeed={merged.rotateSpeed}
      enablePan={merged.enablePan}
      panSpeed={merged.panSpeed}
      minDistance={merged.minDistance}
      maxDistance={merged.maxDistance}
      minPolarAngle={merged.minPolarAngle}
      maxPolarAngle={merged.maxPolarAngle}
      autoRotate={merged.autoRotate}
      autoRotateSpeed={merged.autoRotateSpeed}
      makeDefault
    />
  );
}

export { SceneOrbitControls };
export type { SceneOrbitControlsProps };
