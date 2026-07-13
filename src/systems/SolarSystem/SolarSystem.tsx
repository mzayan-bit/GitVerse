import { useEffect } from 'react';
import { useSolarSystemManager } from './SolarSystemManager';
import { Star } from './Star';
import { OrbitLine } from './OrbitLine';
import { OrbitingPlanet } from './OrbitingPlanet';

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
      {/* Central Star */}
      <Star config={systemConfig.star} />

      {/* Planets and Orbits */}
      {systemConfig.planets.map((node) => (
        <group key={node.id}>
          <OrbitLine config={node.orbit} />
          <OrbitingPlanet node={node} />
        </group>
      ))}
    </group>
  );
}
