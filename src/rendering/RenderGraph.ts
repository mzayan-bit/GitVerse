import * as THREE from 'three';

export interface RenderPassNode {
  id: string;
  enabled: boolean;
  execute: (
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ) => void;
}

export class RenderGraph {
  private passes: RenderPassNode[] = [];

  public addPass(pass: RenderPassNode): void {
    this.passes.push(pass);
  }

  public removePass(id: string): void {
    this.passes = this.passes.filter((p) => p.id !== id);
  }

  public executeGraph(
    renderer: THREE.WebGLRenderer,
    scene: THREE.Scene,
    camera: THREE.Camera
  ): void {
    this.passes.forEach((pass) => {
      if (pass.enabled) {
        pass.execute(renderer, scene, camera);
      }
    });
  }

  public clear(): void {
    this.passes = [];
  }
}
