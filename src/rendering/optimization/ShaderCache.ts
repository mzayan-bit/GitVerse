import * as THREE from 'three';

export class ShaderCache {
  private static instance: ShaderCache | null = null;
  private materialPool: Map<string, THREE.Material> = new Map();

  public static getInstance(): ShaderCache {
    if (!ShaderCache.instance) {
      ShaderCache.instance = new ShaderCache();
    }
    return ShaderCache.instance;
  }

  public getOrCreateStandardMaterial(
    key: string,
    params: THREE.MeshStandardMaterialParameters
  ): THREE.MeshStandardMaterial {
    let mat = this.materialPool.get(key) as THREE.MeshStandardMaterial;
    if (!mat) {
      mat = new THREE.MeshStandardMaterial(params);
      this.materialPool.set(key, mat);
    }
    return mat;
  }

  public getOrCreateBasicMaterial(
    key: string,
    params: THREE.MeshBasicMaterialParameters
  ): THREE.MeshBasicMaterial {
    let mat = this.materialPool.get(key) as THREE.MeshBasicMaterial;
    if (!mat) {
      mat = new THREE.MeshBasicMaterial(params);
      this.materialPool.set(key, mat);
    }
    return mat;
  }

  public disposePool(): void {
    this.materialPool.forEach((mat) => mat.dispose());
    this.materialPool.clear();
  }
}
