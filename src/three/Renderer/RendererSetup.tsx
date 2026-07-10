/* eslint-disable react-hooks/immutability */
'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { ACESFilmicToneMapping, PCFSoftShadowMap, SRGBColorSpace } from 'three';
import type { RendererConfig } from '@/types/rendering';
import { DEFAULT_RENDERER_CONFIG } from '@/constants/rendering';
import { useSceneStore } from '@/store/scene-store';

interface RendererSetupProps {
  config?: Partial<RendererConfig>;
}

/**
 * Declaratively configures the WebGL renderer inside R3F's Canvas.
 * Must be a child of `<Canvas>`.
 */
function RendererSetup({ config }: RendererSetupProps) {
  const gl = useThree((s) => s.gl);
  const setRenderer = useSceneStore((s) => s.setRenderer);

  const merged: RendererConfig = { ...DEFAULT_RENDERER_CONFIG, ...config };

  useEffect(() => {
    gl.toneMapping = merged.toneMapping ?? ACESFilmicToneMapping;
    gl.toneMappingExposure = merged.toneMappingExposure;
    gl.outputColorSpace = merged.outputColorSpace ?? SRGBColorSpace;

    if (merged.shadows) {
      gl.shadowMap.enabled = true;
      gl.shadowMap.type = merged.shadowMapType ?? PCFSoftShadowMap;
    }

    setRenderer(gl);

    return () => {
      setRenderer(null);
    };
  }, [
    gl,
    setRenderer,
    merged.toneMapping,
    merged.toneMappingExposure,
    merged.outputColorSpace,
    merged.shadows,
    merged.shadowMapType,
  ]);

  return null;
}

export { RendererSetup };
export type { RendererSetupProps };
