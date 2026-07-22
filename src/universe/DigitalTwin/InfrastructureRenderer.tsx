import { useEntityManager } from '@/entities/EntityManager';
import { useUniverseManager } from '@/universe/UniverseManager';

export function InfrastructureRenderer() {
  const { hierarchy } = useUniverseManager();
  const { entities } = useEntityManager();

  if (!hierarchy) return null;

  return (
    <group>
      {/* Render Services */}
      {hierarchy.services?.map((svc) => {
        const entity = entities[svc.id];
        if (!entity || !entity.transform) return null;
        return (
          <group key={svc.id} position={entity.transform.position}>
            <mesh>
              <boxGeometry args={[40, 40, 40]} />
              <meshStandardMaterial color="#00ffcc" wireframe />
            </mesh>
          </group>
        );
      })}

      {/* Render Databases */}
      {hierarchy.databases?.map((db) => {
        const entity = entities[db.id];
        if (!entity || !entity.transform) return null;
        return (
          <group key={db.id} position={entity.transform.position}>
            <mesh>
              <cylinderGeometry args={[20, 20, 40, 32]} />
              <meshStandardMaterial color="#ff0055" wireframe />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}
