import * as THREE from 'three';

export class ShaderComposer {
  public static composeMaterial(
    vertCode: string,
    fragCode: string,
    uniforms: Record<string, THREE.IUniform> = {},
    transparent = true
  ): THREE.ShaderMaterial {
    return new THREE.ShaderMaterial({
      vertexShader: vertCode,
      fragmentShader: fragCode,
      uniforms,
      transparent,
      depthWrite: !transparent,
    });
  }
}
