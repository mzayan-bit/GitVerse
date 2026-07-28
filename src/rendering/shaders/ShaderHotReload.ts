import * as THREE from 'three';

export class ShaderHotReload {
  private static instance: ShaderHotReload | null = null;
  private activeMaterials: Map<string, THREE.ShaderMaterial> = new Map();

  public static getInstance(): ShaderHotReload {
    if (!ShaderHotReload.instance) {
      ShaderHotReload.instance = new ShaderHotReload();
    }
    return ShaderHotReload.instance;
  }

  public registerMaterial(id: string, mat: THREE.ShaderMaterial): void {
    this.activeMaterials.set(id, mat);
  }

  public updateUniform(id: string, name: string, value: unknown): void {
    const mat = this.activeMaterials.get(id);
    if (mat && mat.uniforms[name]) {
      mat.uniforms[name].value = value;
      mat.uniformsNeedUpdate = true;
    }
  }
}
