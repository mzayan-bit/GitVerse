/**
 * SpatialIndex — Octree & Spatial Hash Partitioning for 3D Sector Querying.
 * Enables O(1) / O(log N) sector lookups, frustum culling, and proximity queries.
 */

export interface SpatialObject {
  id: string;
  position: [number, number, number];
  radius: number;
  data: unknown;
}

export class SpatialIndex {
  private cellSize: number;
  private grid: Map<string, SpatialObject[]> = new Map();

  constructor(cellSize = 500) {
    this.cellSize = cellSize;
  }

  private getCellKey(x: number, y: number, z: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    const cz = Math.floor(z / this.cellSize);
    return `${cx}:${cy}:${cz}`;
  }

  public insert(obj: SpatialObject): void {
    const key = this.getCellKey(...obj.position);
    let cell = this.grid.get(key);
    if (!cell) {
      cell = [];
      this.grid.set(key, cell);
    }
    cell.push(obj);
  }

  public remove(id: string, position: [number, number, number]): boolean {
    const key = this.getCellKey(...position);
    const cell = this.grid.get(key);
    if (!cell) return false;
    const index = cell.findIndex((item) => item.id === id);
    if (index !== -1) {
      cell.splice(index, 1);
      if (cell.length === 0) this.grid.delete(key);
      return true;
    }
    return false;
  }

  public queryRadius(
    center: [number, number, number],
    radius: number
  ): SpatialObject[] {
    const results: SpatialObject[] = [];
    const minCx = Math.floor((center[0] - radius) / this.cellSize);
    const maxCx = Math.floor((center[0] + radius) / this.cellSize);
    const minCy = Math.floor((center[1] - radius) / this.cellSize);
    const maxCy = Math.floor((center[1] + radius) / this.cellSize);
    const minCz = Math.floor((center[2] - radius) / this.cellSize);
    const maxCz = Math.floor((center[2] + radius) / this.cellSize);

    const radiusSq = radius * radius;

    for (let cx = minCx; cx <= maxCx; cx++) {
      for (let cy = minCy; cy <= maxCy; cy++) {
        for (let cz = minCz; cz <= maxCz; cz++) {
          const key = `${cx}:${cy}:${cz}`;
          const cell = this.grid.get(key);
          if (cell) {
            for (const item of cell) {
              const dx = item.position[0] - center[0];
              const dy = item.position[1] - center[1];
              const dz = item.position[2] - center[2];
              if (dx * dx + dy * dy + dz * dz <= radiusSq) {
                results.push(item);
              }
            }
          }
        }
      }
    }

    return results;
  }

  public clear(): void {
    this.grid.clear();
  }
}
