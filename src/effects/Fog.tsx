/* eslint-disable react-hooks/immutability, react-hooks/exhaustive-deps */
'use client';

import { FogExp2 } from 'three';
import { useThree, useFrame } from '@react-three/fiber';
import { useEffect } from 'react';
import { useThemeManager } from '@/rendering/themes/ThemeManager';

/**
 * Applies cinematic exponential fog to the scene, driven by ThemeManager.
 * Must be a child of `<Canvas>`.
 */
function SceneFog() {
  const scene = useThree((s) => s.scene);
  const theme = useThemeManager((s) => s.activeTheme);

  useEffect(() => {
    // We use FogExp2 because it looks more cinematic than linear Fog
    scene.fog = new FogExp2(
      theme.environment.fogColor,
      theme.environment.fogDensity
    );
    return () => {
      scene.fog = null;
    };
  }, [scene]);

  // Update fog properties smoothly every frame
  useFrame(() => {
    if (scene.fog instanceof FogExp2) {
      scene.fog.color.set(
        useThemeManager.getState().activeTheme.environment.fogColor
      );
      scene.fog.density =
        useThemeManager.getState().activeTheme.environment.fogDensity;
    }
  });

  return null;
}

export { SceneFog };
