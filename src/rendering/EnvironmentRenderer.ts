import * as THREE from 'three';

export class EnvironmentRenderer {
  private ambientLight: THREE.AmbientLight;

  constructor() {
    this.ambientLight = new THREE.AmbientLight(0x0e1418, 0.8);
  }

  public attachToScene(scene: THREE.Scene): void {
    scene.add(this.ambientLight);
  }

  public updateAmbientColor(color: string, intensity: number): void {
    this.ambientLight.color.set(color);
    this.ambientLight.intensity = intensity;
  }
}
