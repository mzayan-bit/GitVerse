/* eslint-disable react-hooks/immutability */
'use client';

import { Fog as ThreeFog } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import type { FogConfig } from '@/types/rendering';
import { DEFAULT_FOG_CONFIG } from '@/constants/rendering';

interface SceneFogProps {
  config?: Partial<FogConfig>;
}

/**
 * Applies linear fog to the scene.
 * Must be a child of `<Canvas>`.
 */
function SceneFog({ config }: SceneFogProps) {
  const scene = useThree((s) => s.scene);

  const merged: FogConfig = { ...DEFAULT_FOG_CONFIG, ...config };

  useEffect(() => {
    if (merged.enabled) {
      scene.fog = new ThreeFog(merged.color, merged.near, merged.far);
    } else {
      scene.fog = null;
    }

    return () => {
      scene.fog = null;
    };
  }, [scene, merged.enabled, merged.color, merged.near, merged.far]);

  return null;
}

export { SceneFog };
export type { SceneFogProps };
