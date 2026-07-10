'use client';

import type { EnvironmentConfig } from '@/types/rendering';
import { DEFAULT_ENVIRONMENT_CONFIG } from '@/constants/rendering';

interface EnvironmentSetupProps {
  config?: Partial<EnvironmentConfig>;
}

/**
 * Configures the scene environment — background colour and ambient lighting.
 * Must be a child of `<Canvas>`.
 *
 * Future extensions:
 *  - HDR environment maps
 *  - Skybox / skydome
 *  - Environment probes
 */
function EnvironmentSetup({ config }: EnvironmentSetupProps) {
  const merged: EnvironmentConfig = {
    ...DEFAULT_ENVIRONMENT_CONFIG,
    ...config,
  };

  return (
    <>
      <color attach="background" args={[merged.backgroundColor]} />
      <ambientLight
        intensity={merged.ambientIntensity}
        color={merged.ambientColor}
      />
    </>
  );
}

export { EnvironmentSetup };
export type { EnvironmentSetupProps };
