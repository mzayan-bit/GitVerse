import * as THREE from 'three';

export class PlanetCache {
  private static geometryCache = new Map<string, THREE.BufferGeometry>();
  private static materialCache = new Map<string, THREE.Material>();

  static getGeometry(key: string): THREE.BufferGeometry | undefined {
    return this.geometryCache.get(key);
  }

  static setGeometry(key: string, geometry: THREE.BufferGeometry) {
    this.geometryCache.set(key, geometry);
  }

  static getMaterial(key: string): THREE.Material | undefined {
    return this.materialCache.get(key);
  }

  static setMaterial(key: string, material: THREE.Material) {
    this.materialCache.set(key, material);
  }

  static clear() {
    this.geometryCache.forEach((geo) => geo.dispose());
    this.geometryCache.clear();

    this.materialCache.forEach((mat) => mat.dispose());
    this.materialCache.clear();
  }
}
