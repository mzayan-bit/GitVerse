'use client';

import { useFrame } from '@react-three/fiber';
import { useThemeManager } from './ThemeManager';

/**
 * Headless component that drives theme interpolation every frame.
 * Must be a child of `<Canvas>`.
 */
export function ThemeController() {
  const updateTransition = useThemeManager((s) => s.updateTransition);

  useFrame((_, delta) => {
    updateTransition(delta);
  });

  return null;
}
