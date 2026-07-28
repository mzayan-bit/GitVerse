import * as THREE from 'three';

export class ReflectionSystem {
  public createCubeCamera(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene
  ): THREE.CubeCamera {
    const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, {
      generateMipmaps: true,
      minFilter: THREE.LinearMipmapLinearFilter,
    });
    const cubeCamera = new THREE.CubeCamera(1, 10000, cubeRenderTarget);
    cubeCamera.update(renderer, scene);
    return cubeCamera;
  }
}
