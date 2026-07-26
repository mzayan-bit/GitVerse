'use client';

import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
  ChromaticAberration,
  SSAO,
  SMAA,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { useRendererManager } from '../core/RendererManager';

/**
 * CinematicPostProcessing — Replaces the basic PostProcessing with a
 * high-end cinematic pipeline, driven by the RendererManager store.
 */
export function CinematicPostProcessing() {
  const postFx = useRendererManager((s) => s.postFx);
  const quality = useRendererManager((s) => s.quality);

  return (
    <EffectComposer multisampling={quality.antialias ? 4 : 0}>
      {/* SMAA (Subpixel Morphological Antialiasing) for crisp edges */}
      {postFx.fxaa.enabled && <SMAA />}

      {/* Screen Space Ambient Occlusion for deep shadows in geometry */}
      {postFx.ssao.enabled && (
        <SSAO
          blendFunction={BlendFunction.MULTIPLY}
          samples={31}
          radius={postFx.ssao.radius}
          intensity={postFx.ssao.intensity}
          luminanceInfluence={0.6}
          color="black"
        />
      )}

      {/* Cinematic Depth of Field */}
      {postFx.depthOfField.enabled && (
        <DepthOfField
          focusDistance={postFx.depthOfField.focusDistance}
          focalLength={postFx.depthOfField.focalLength}
          bokehScale={postFx.depthOfField.bokehScale}
          height={480}
        />
      )}

      {/* Premium Bloom (high threshold, large blur for cinematic glow) */}
      {postFx.bloom.enabled && (
        <Bloom
          intensity={postFx.bloom.intensity}
          luminanceThreshold={postFx.bloom.threshold}
          luminanceSmoothing={postFx.bloom.smoothing}
          mipmapBlur={true}
          blendFunction={BlendFunction.SCREEN}
        />
      )}

      {/* Subtle Chromatic Aberration for lens realism */}
      {postFx.chromaticAberration.enabled && (
        <ChromaticAberration
          offset={
            new THREE.Vector2(
              postFx.chromaticAberration.offset,
              postFx.chromaticAberration.offset
            )
          }
          blendFunction={BlendFunction.NORMAL}
          radialModulation={true}
          modulationOffset={0.25}
        />
      )}

      {/* Vignette to draw eye to center */}
      {postFx.vignette.enabled && (
        <Vignette
          eskil={false}
          offset={postFx.vignette.offset}
          darkness={postFx.vignette.darkness}
          blendFunction={BlendFunction.NORMAL}
        />
      )}
    </EffectComposer>
  );
}
