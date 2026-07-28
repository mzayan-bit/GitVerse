import * as THREE from 'three';

export interface CustomShaderConfig {
  id: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms?: Record<string, THREE.IUniform>;
  transparent?: boolean;
}

export class ShaderManager {
  private static instance: ShaderManager | null = null;

  private compiledShaders: Map<string, THREE.ShaderMaterial> = new Map();

  public static getInstance(): ShaderManager {
    if (!ShaderManager.instance) {
      ShaderManager.instance = new ShaderManager();
    }
    return ShaderManager.instance;
  }

  public compileShader(config: CustomShaderConfig): THREE.ShaderMaterial {
    let mat = this.compiledShaders.get(config.id);
    if (!mat) {
      mat = new THREE.ShaderMaterial({
        vertexShader: config.vertexShader,
        fragmentShader: config.fragmentShader,
        uniforms: config.uniforms || {},
        transparent: config.transparent ?? true,
      });
      this.compiledShaders.set(config.id, mat);
    }
    return mat;
  }

  public updateUniform(
    shaderId: string,
    uniformName: string,
    value: unknown
  ): void {
    const mat = this.compiledShaders.get(shaderId);
    if (mat && mat.uniforms[uniformName]) {
      mat.uniforms[uniformName].value = value;
    }
  }

  public getShader(shaderId: string): THREE.ShaderMaterial | undefined {
    return this.compiledShaders.get(shaderId);
  }
}
