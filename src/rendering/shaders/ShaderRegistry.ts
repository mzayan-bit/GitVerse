import * as THREE from 'three';

export interface RegisteredShader {
  name: string;
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, THREE.IUniform>;
}

export class ShaderRegistry {
  private static instance: ShaderRegistry | null = null;
  private shaders: Map<string, RegisteredShader> = new Map();

  public static getInstance(): ShaderRegistry {
    if (!ShaderRegistry.instance) {
      ShaderRegistry.instance = new ShaderRegistry();
    }
    return ShaderRegistry.instance;
  }

  public register(shader: RegisteredShader): void {
    this.shaders.set(shader.name, shader);
  }

  public get(name: string): RegisteredShader | undefined {
    return this.shaders.get(name);
  }

  public getAll(): RegisteredShader[] {
    return Array.from(this.shaders.values());
  }
}
