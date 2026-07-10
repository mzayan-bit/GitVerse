'use client';

import { Environment } from '@react-three/drei';
import type { EnvironmentConfig } from '@/types/rendering';
import { DEFAULT_ENVIRONMENT_CONFIG } from '@/constants/rendering';

interface EnvironmentSetupProps {
  config?: Partial<EnvironmentConfig>;
}

/**
 * Configures the scene environment — background colour and ambient lighting.
 * Must be a child of `<Canvas>`.
 */
function EnvironmentSetup({ config }: EnvironmentSetupProps) {
  const merged: EnvironmentConfig = {
    ...DEFAULT_ENVIRONMENT_CONFIG,
    ...config,
  };

  return (
    <>
      <color attach="background" args={[merged.backgroundColor]} />
      {merged.preset && (
        <Environment
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          preset={merged.preset as any}
          environmentIntensity={merged.environmentIntensity}
        />
      )}
    </>
  );
}

export { EnvironmentSetup };
export type { EnvironmentSetupProps };
