import * as THREE from 'three';

export class ShadowEngine {
  public configureShadows(renderer: THREE.WebGLRenderer): void {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  }
}
