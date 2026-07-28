import * as THREE from 'three';

export interface ShaderDebugInfo {
  id: string;
  uniforms: Array<{ name: string; type: string; value: unknown }>;
}

export class ShaderDebugger {
  public static inspectShader(
    mat: THREE.ShaderMaterial,
    id: string
  ): ShaderDebugInfo {
    const uniforms = Object.entries(mat.uniforms).map(([name, u]) => ({
      name,
      type: typeof u.value,
      value: u.value,
    }));
    return { id, uniforms };
  }
}
