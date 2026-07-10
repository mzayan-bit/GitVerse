'use client';

import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import type { PostProcessingConfig } from '@/types/rendering';
import { DEFAULT_POST_PROCESSING_CONFIG } from '@/constants/rendering';

interface PostProcessingProps {
  config?: Partial<PostProcessingConfig>;
}

/**
 * Post-processing pipeline.
 */
function PostProcessing({ config }: PostProcessingProps) {
  const merged: PostProcessingConfig = {
    ...DEFAULT_POST_PROCESSING_CONFIG,
    ...config,
    bloom: {
      ...DEFAULT_POST_PROCESSING_CONFIG.bloom,
      ...config?.bloom,
    },
    vignette: {
      ...DEFAULT_POST_PROCESSING_CONFIG.vignette,
      ...config?.vignette,
    },
    noise: {
      ...DEFAULT_POST_PROCESSING_CONFIG.noise,
      ...config?.noise,
    },
    chromaticAberration: {
      ...DEFAULT_POST_PROCESSING_CONFIG.chromaticAberration,
      ...config?.chromaticAberration,
    },
  };

  if (!merged.enabled) return null;

  return (
    <EffectComposer multisampling={0}>
      {merged.bloom.enabled ? (
        <Bloom
          intensity={merged.bloom.intensity}
          luminanceThreshold={merged.bloom.luminanceThreshold}
          luminanceSmoothing={merged.bloom.luminanceSmoothing}
          mipmapBlur={merged.bloom.mipmapBlur}
        />
      ) : (
        <></>
      )}

      {merged.chromaticAberration.enabled ? (
        <ChromaticAberration
          offset={
            new THREE.Vector2(
              merged.chromaticAberration.offset[0],
              merged.chromaticAberration.offset[1]
            )
          }
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
      ) : (
        <></>
      )}

      {merged.noise.enabled ? (
        <Noise
          opacity={merged.noise.opacity}
          blendFunction={BlendFunction.OVERLAY}
        />
      ) : (
        <></>
      )}

      {merged.vignette.enabled ? (
        <Vignette
          eskil={false}
          offset={merged.vignette.offset}
          darkness={merged.vignette.darkness}
          blendFunction={BlendFunction.NORMAL}
        />
      ) : (
        <></>
      )}
    </EffectComposer>
  );
}

export { PostProcessing };
export type { PostProcessingProps };
