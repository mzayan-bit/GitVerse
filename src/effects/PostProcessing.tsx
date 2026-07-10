'use client';

import { EffectComposer, Bloom } from '@react-three/postprocessing';
import type { PostProcessingConfig } from '@/types/rendering';
import { DEFAULT_POST_PROCESSING_CONFIG } from '@/constants/rendering';

interface PostProcessingProps {
  config?: Partial<PostProcessingConfig>;
}

/**
 * Post-processing pipeline.
 * Wraps `@react-three/postprocessing`'s EffectComposer.
 * Must be a child of `<Canvas>`.
 *
 * Future effect pipeline extensions:
 *  - Vignette
 *  - SSAO (Screen Space Ambient Occlusion)
 *  - Film grain / noise
 *  - Depth of field
 *  - Color grading / LUTs
 */
function PostProcessing({ config }: PostProcessingProps) {
  const merged: PostProcessingConfig = {
    ...DEFAULT_POST_PROCESSING_CONFIG,
    ...config,
    bloom: {
      ...DEFAULT_POST_PROCESSING_CONFIG.bloom,
      ...config?.bloom,
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
    </EffectComposer>
  );
}

export { PostProcessing };
export type { PostProcessingProps };
