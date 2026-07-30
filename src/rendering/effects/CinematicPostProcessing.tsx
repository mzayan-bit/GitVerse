'use client';

import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

/**
 * Ultra-performance 60 FPS Post-Processing Pipeline.
 * Eliminates heavy SSAO & DepthOfField bottlenecks for smooth 60 FPS.
 */
export function CinematicPostProcessing() {
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={0.6}
        luminanceThreshold={0.7}
        luminanceSmoothing={0.5}
        mipmapBlur={false}
        blendFunction={BlendFunction.SCREEN}
      />
      <Vignette
        eskil={false}
        offset={0.3}
        darkness={0.6}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
