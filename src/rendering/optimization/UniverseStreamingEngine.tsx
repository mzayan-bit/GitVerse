import { useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { GalaxyEngine } from '@/engine/universe/GalaxyEngine';
import { FrustumCuller } from './FrustumCuller';
import { ProceduralPlanetMesh } from '@/rendering/environment/ProceduralPlanetMesh';
import { PlanetData } from '@/engine/universe/PlanetFactory';

export function UniverseStreamingEngine() {
  const { camera } = useThree();
  const frustumCullerRef = useRef(new FrustumCuller());
  const [activePlanets, setActivePlanets] = useState<PlanetData[]>([]);

  useFrame(() => {
    const engine = GalaxyEngine.getInstance();
    const sectorMgr = engine.getSectorManager();

    const camPos: [number, number, number] = [
      camera.position.x,
      camera.position.y,
      camera.position.z,
    ];

    // Update active 3D sectors
    sectorMgr.updateCameraPosition(camPos);

    // Update Frustum
    frustumCullerRef.current.updateFrustum(camera);

    // Query active objects from SpatialIndex
    const activeObjects = sectorMgr.getActiveObjects(camPos);

    const visiblePlanets: PlanetData[] = [];

    activeObjects.forEach((obj) => {
      // Frustum Culling Test
      if (
        frustumCullerRef.current.isSphereInFrustum(obj.position, obj.radius * 2)
      ) {
        if ((obj.data as PlanetData).repoName) {
          visiblePlanets.push(obj.data as PlanetData);
        }
      }
    });

    if (visiblePlanets.length !== activePlanets.length) {
      setActivePlanets(visiblePlanets);
    }
  });

  return (
    <group>
      {/* Streamed Render Targets */}
      {activePlanets.map((p) => (
        <ProceduralPlanetMesh key={p.id} planet={p} />
      ))}
    </group>
  );
}
