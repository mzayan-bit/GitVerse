import * as THREE from 'three';

export type LODLevel = 'HIGH' | 'MEDIUM' | 'LOW' | 'BILLBOARD' | 'CULLED';

export interface LODThresholds {
  highDistance: number;
  mediumDistance: number;
  lowDistance: number;
  cullDistance: number;
}

export class LODManager {
  private static DEFAULT_THRESHOLDS: LODThresholds = {
    highDistance: 600,
    mediumDistance: 1800,
    lowDistance: 3800,
    cullDistance: 6000,
  };

  /**
   * Determine LOD level based on distance to camera
   */
  public static calculateLOD(
    objectPos: THREE.Vector3 | [number, number, number],
    cameraPos: THREE.Vector3,
    thresholds: Partial<LODThresholds> = {}
  ): LODLevel {
    const t = { ...LODManager.DEFAULT_THRESHOLDS, ...thresholds };

    const posX = Array.isArray(objectPos) ? objectPos[0] : objectPos.x;
    const posY = Array.isArray(objectPos) ? objectPos[1] : objectPos.y;
    const posZ = Array.isArray(objectPos) ? objectPos[2] : objectPos.z;

    const dx = posX - cameraPos.x;
    const dy = posY - cameraPos.y;
    const dz = posZ - cameraPos.z;
    const distSq = dx * dx + dy * dy + dz * dz;

    if (distSq > t.cullDistance * t.cullDistance) return 'CULLED';
    if (distSq > t.lowDistance * t.lowDistance) return 'BILLBOARD';
    if (distSq > t.mediumDistance * t.mediumDistance) return 'LOW';
    if (distSq > t.highDistance * t.highDistance) return 'MEDIUM';
    return 'HIGH';
  }
}
