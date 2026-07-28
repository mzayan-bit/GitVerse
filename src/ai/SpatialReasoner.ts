import * as THREE from 'three';

export interface SpatialLocation {
  sectorKey: string;
  nearestEntityId?: string;
  nearestEntityName?: string;
  distanceToNearest: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
}

export class SpatialReasoner {
  private static instance: SpatialReasoner | null = null;

  public static getInstance(): SpatialReasoner {
    if (!SpatialReasoner.instance) {
      SpatialReasoner.instance = new SpatialReasoner();
    }
    return SpatialReasoner.instance;
  }

  /**
   * Determine spatial location context relative to 3D universe entities
   */
  public evaluateSpatialContext(
    cameraPos: THREE.Vector3 | [number, number, number],
    cameraTarget: THREE.Vector3 | [number, number, number],
    entities: Array<{
      id: string;
      name: string;
      position: [number, number, number];
    }>
  ): SpatialLocation {
    const camPosVec = Array.isArray(cameraPos)
      ? new THREE.Vector3(...cameraPos)
      : cameraPos;
    const camTargetVec = Array.isArray(cameraTarget)
      ? new THREE.Vector3(...cameraTarget)
      : cameraTarget;

    const sx = Math.floor(camPosVec.x / 1200);
    const sy = Math.floor(camPosVec.y / 1200);
    const sz = Math.floor(camPosVec.z / 1200);
    const sectorKey = `${sx}:${sy}:${sz}`;

    let nearestEntityId: string | undefined;
    let nearestEntityName: string | undefined;
    let minDistance = Infinity;

    entities.forEach((entity) => {
      const ePos = new THREE.Vector3(...entity.position);
      const dist = camPosVec.distanceTo(ePos);
      if (dist < minDistance) {
        minDistance = dist;
        nearestEntityId = entity.id;
        nearestEntityName = entity.name;
      }
    });

    return {
      sectorKey,
      nearestEntityId,
      nearestEntityName,
      distanceToNearest: parseFloat(minDistance.toFixed(1)),
      cameraPosition: [camPosVec.x, camPosVec.y, camPosVec.z],
      cameraTarget: [camTargetVec.x, camTargetVec.y, camTargetVec.z],
    };
  }
}
