import { ProceduralStarField } from './ProceduralStarField';
import { ProceduralNebula } from './ProceduralNebula';
import { AsteroidBelt } from './AsteroidBelt';
import { CometShower } from './CometShower';
import { CosmicSingularity } from './CosmicSingularity';

export function ProceduralSpaceEnvironment() {
  return (
    <group>
      {/* Dynamic Multi-Temperature Star Field */}
      <ProceduralStarField count={10000} radius={14000} />

      {/* Volumetric Noise Nebulae */}
      <ProceduralNebula />

      {/* Galactic Asteroid Belt Ring */}
      <AsteroidBelt count={700} innerRadius={1200} outerRadius={2200} />

      {/* Shooting Stars & Comets */}
      <CometShower count={6} />

      {/* Cosmic Anomalies / Black Holes / Pulsars */}
      <CosmicSingularity
        type="BlackHole"
        position={[2800, 400, -3200]}
        size={70}
      />
      <CosmicSingularity
        type="Pulsar"
        position={[-3000, -500, 2500]}
        size={45}
      />
    </group>
  );
}
