import * as THREE from 'three';

export class GeometryAtlas {
  private static instance: GeometryAtlas | null = null;

  private sphereGeometries: Map<number, THREE.SphereGeometry> = new Map();
  private ringGeometries: Map<string, THREE.RingGeometry> = new Map();
  private cylinderGeometries: Map<string, THREE.CylinderGeometry> = new Map();

  public static getInstance(): GeometryAtlas {
    if (!GeometryAtlas.instance) {
      GeometryAtlas.instance = new GeometryAtlas();
    }
    return GeometryAtlas.instance;
  }

  public getSphereGeometry(segments = 32): THREE.SphereGeometry {
    let geo = this.sphereGeometries.get(segments);
    if (!geo) {
      geo = new THREE.SphereGeometry(1, segments, segments);
      this.sphereGeometries.set(segments, geo);
    }
    return geo;
  }

  public getRingGeometry(
    inner = 1.4,
    outer = 2.2,
    segments = 64
  ): THREE.RingGeometry {
    const key = `${inner}:${outer}:${segments}`;
    let geo = this.ringGeometries.get(key);
    if (!geo) {
      geo = new THREE.RingGeometry(inner, outer, segments);
      this.ringGeometries.set(key, geo);
    }
    return geo;
  }

  public getCylinderGeometry(
    radiusTop = 1,
    radiusBottom = 1,
    height = 10,
    segments = 16
  ): THREE.CylinderGeometry {
    const key = `${radiusTop}:${radiusBottom}:${height}:${segments}`;
    let geo = this.cylinderGeometries.get(key);
    if (!geo) {
      geo = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        segments
      );
      this.cylinderGeometries.set(key, geo);
    }
    return geo;
  }

  public disposeAll(): void {
    this.sphereGeometries.forEach((g) => g.dispose());
    this.ringGeometries.forEach((g) => g.dispose());
    this.cylinderGeometries.forEach((g) => g.dispose());
    this.sphereGeometries.clear();
    this.ringGeometries.clear();
    this.cylinderGeometries.clear();
  }
}
