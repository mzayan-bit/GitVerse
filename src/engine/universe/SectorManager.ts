import { SpatialIndex, SpatialObject } from './SpatialIndex';

export interface SectorChunk {
  key: string;
  coord: [number, number, number];
  bounds: { min: [number, number, number]; max: [number, number, number] };
  isLoaded: boolean;
  objects: SpatialObject[];
}

export class SectorManager {
  private sectorSize: number;
  private spatialIndex: SpatialIndex;
  private activeSectors: Map<string, SectorChunk> = new Map();
  private renderDistance: number;

  constructor(sectorSize = 1000, renderDistance = 3500) {
    this.sectorSize = sectorSize;
    this.spatialIndex = new SpatialIndex(sectorSize);
    this.renderDistance = renderDistance;
  }

  public getSectorKey(x: number, y: number, z: number): string {
    const sx = Math.floor(x / this.sectorSize);
    const sy = Math.floor(y / this.sectorSize);
    const sz = Math.floor(z / this.sectorSize);
    return `${sx}:${sy}:${sz}`;
  }

  public registerObject(obj: SpatialObject): void {
    this.spatialIndex.insert(obj);
    const key = this.getSectorKey(...obj.position);
    let chunk = this.activeSectors.get(key);
    if (!chunk) {
      const [x, y, z] = obj.position;
      const sx = Math.floor(x / this.sectorSize);
      const sy = Math.floor(y / this.sectorSize);
      const sz = Math.floor(z / this.sectorSize);

      chunk = {
        key,
        coord: [sx, sy, sz],
        bounds: {
          min: [
            sx * this.sectorSize,
            sy * this.sectorSize,
            sz * this.sectorSize,
          ],
          max: [
            (sx + 1) * this.sectorSize,
            (sy + 1) * this.sectorSize,
            (sz + 1) * this.sectorSize,
          ],
        },
        isLoaded: true,
        objects: [],
      };
      this.activeSectors.set(key, chunk);
    }
    chunk.objects.push(obj);
  }

  /**
   * Update streaming sectors based on camera position
   */
  public updateCameraPosition(cameraPos: [number, number, number]): {
    loadedChunks: SectorChunk[];
    unloadedKeys: string[];
  } {
    const loadedChunks: SectorChunk[] = [];
    const unloadedKeys: string[] = [];

    const camX = cameraPos[0];
    const camY = cameraPos[1];
    const camZ = cameraPos[2];

    const range = Math.ceil(this.renderDistance / this.sectorSize);
    const centerSx = Math.floor(camX / this.sectorSize);
    const centerSy = Math.floor(camY / this.sectorSize);
    const centerSz = Math.floor(camZ / this.sectorSize);

    const neededKeys = new Set<string>();

    for (let dx = -range; dx <= range; dx++) {
      for (let dy = -range; dy <= range; dy++) {
        for (let dz = -range; dz <= range; dz++) {
          const key = `${centerSx + dx}:${centerSy + dy}:${centerSz + dz}`;
          neededKeys.add(key);
        }
      }
    }

    // Check currently active sectors
    this.activeSectors.forEach((chunk, key) => {
      if (neededKeys.has(key)) {
        chunk.isLoaded = true;
        loadedChunks.push(chunk);
      } else {
        if (chunk.isLoaded) {
          chunk.isLoaded = false;
          unloadedKeys.push(key);
        }
      }
    });

    return { loadedChunks, unloadedKeys };
  }

  public getActiveObjects(
    cameraPos: [number, number, number]
  ): SpatialObject[] {
    return this.spatialIndex.queryRadius(cameraPos, this.renderDistance);
  }

  public clear(): void {
    this.activeSectors.clear();
    this.spatialIndex.clear();
  }
}
