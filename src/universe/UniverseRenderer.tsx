import { useUniverseManager } from './UniverseManager';
import { useEntityManager } from '@/entities/EntityManager';
import { useMemo } from 'react';
import { Planet } from '@/planets/Planet';
import { PlanetFactory } from '@/planets/PlanetFactory';
import { MappedVisualProperties } from '@/mapping/MappingEngine';

export function UniverseRenderer() {
  const { isBuilt, hierarchy } = useUniverseManager();
  const { entities } = useEntityManager();

  // If universe isn't built yet, don't render it.
  // We can leave the default background rendering from before if we want.
  if (!isBuilt) return null;

  return (
    <group>
      {/* Render Galaxies (Orgs) */}
      {hierarchy.galaxies.map((galaxy) => {
        const entity = entities[galaxy.id];
        if (!entity) return null;

        return (
          <group key={galaxy.id} position={entity.transform?.position}>
            {/* We could render a galactic core or nebula here representing the org */}
            <mesh>
              <sphereGeometry args={[100, 32, 32]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.05} />
            </mesh>

            {/* Render Solar Systems (Groups) inside the Galaxy */}
            {galaxy.systemIds.map((sysId) => (
              <SolarSystemRenderer key={sysId} systemId={sysId} />
            ))}
          </group>
        );
      })}
    </group>
  );
}

function SolarSystemRenderer({ systemId }: { systemId: string }) {
  const { entities } = useEntityManager();
  const { hierarchy } = useUniverseManager();
  const entity = entities[systemId];

  if (!entity) return null;

  const systemNode = hierarchy.solarSystems.find((s) => s.id === systemId);
  if (!systemNode) return null;

  return (
    <group position={entity.transform?.position}>
      {/* System central star (Language marker) */}
      <mesh>
        <sphereGeometry args={[10, 32, 32]} />
        <meshBasicMaterial color="#ffcc00" transparent opacity={0.8} />
      </mesh>
      <pointLight color="#ffcc00" intensity={2} distance={500} />

      {/* Render Planets in this system */}
      {systemNode.planetIds.map((planetId) => (
        <PlanetRenderer key={planetId} planetId={planetId} />
      ))}
    </group>
  );
}

function PlanetRenderer({ planetId }: { planetId: string }) {
  const { entities } = useEntityManager();
  const entity = entities[planetId];

  const config = useMemo(() => {
    if (!entity?.metadata?.visuals) return null;
    const visuals = entity.metadata.visuals as MappedVisualProperties;

    // Generate base config using the seed
    const c = PlanetFactory.create(visuals.biomeSeed || planetId);

    // Apply mapped visuals
    c.terrain.baseRadius = visuals.size || 2.0;
    c.atmosphere.color = visuals.baseColor || '#ffffff';
    c.terrain.displacementStrength += (visuals.craterDensity || 0) * 2;
    if (visuals.isFrozen) {
      c.type = 'ice';
    }

    return c;
  }, [entity, planetId]);

  if (!entity || !config) return null;

  return (
    <group position={entity.transform?.position}>
      <Planet config={config} autoRotate={true} />
    </group>
  );
}
