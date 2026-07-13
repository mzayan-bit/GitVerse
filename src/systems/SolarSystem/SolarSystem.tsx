import React, { useEffect } from 'react';
import { useSolarSystemManager } from './SolarSystemManager';

export function SolarSystem() {
  const { systemConfig, generateSystem } = useSolarSystemManager();

  // Initialize the system if not already
  useEffect(() => {
    if (!systemConfig) {
      generateSystem('gitverse-genesis-system');
    }
  }, [systemConfig, generateSystem]);

  if (!systemConfig) return null;

  return (
    <group>
      {/* Star implementation to come in Step 3 */}
      {/* Planet / Orbit implementation to come in Step 4 */}
    </group>
  );
}
