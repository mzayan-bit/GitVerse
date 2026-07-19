import { useUniverseManager } from './UniverseManager';
import { useEntityManager } from '@/entities/EntityManager';
import React, { useMemo, useRef } from 'react';
import { Planet } from '@/planets/Planet';
import { PlanetFactory } from '@/planets/PlanetFactory';
import { MappedVisualProperties } from '@/mapping/MappingEngine';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import { useRepositoryScene } from '@/repository-scene';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';

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
    <React.Fragment>
      <group position={entity.transform?.position}>
        {/* System central star (Language marker) */}
        <mesh>
          <sphereGeometry args={[10, 32, 32]} />
          <meshBasicMaterial color="#ffcc00" transparent opacity={0.8} />
        </mesh>
      </group>

      {/* Render Planets in this system globally */}
      {systemNode.planetIds.map((planetId) => (
        <PlanetRenderer key={planetId} planetId={planetId} />
      ))}
    </React.Fragment>
  );
}

function PlanetRenderer({ planetId }: { planetId: string }) {
  const { entities } = useEntityManager();
  const entity = entities[planetId];

  const groupRef = useRef<THREE.Group>(null);

  // Throttled distance calculation for LOD/Culling
  useFrame(({ camera }) => {
    if (!groupRef.current) return;
    // Only calculate distance every few frames or based on camera movement to save CPU
    // For simplicity, we calculate directly
    const dist = camera.position.distanceTo(groupRef.current.position);
    // Mutate visibility based on distance directly on the ref to avoid react renders
    if (dist > 50000) {
      groupRef.current.visible = false;
    } else {
      groupRef.current.visible = true;
    }
  });

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
    <group
      ref={groupRef}
      position={entity.transform?.position}
      onClick={(e) => {
        e.stopPropagation();
        useUniverseManager.getState().focusEntity(planetId);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        // Enter the repository planet
        const repo = entity?.metadata?.repository as
          RepositoryDomainModel | undefined;
        if (repo) {
          useRepositoryScene.getState().enterRepository(repo, planetId);
        }
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        useUniverseManager.getState().setHoveredEntity(planetId);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'auto';
        useUniverseManager.getState().setHoveredEntity(null);
      }}
    >
      <Planet config={config} autoRotate={true} />
    </group>
  );
}
