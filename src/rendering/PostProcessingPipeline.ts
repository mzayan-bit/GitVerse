import * as THREE from 'three';

export interface PostProcessingConfig {
  bloomIntensity: number;
  chromaticAberration: number;
  vignette: number;
  exposure: number;
  toneMapping: THREE.ToneMapping;
}

export class PostProcessingPipeline {
  private config: PostProcessingConfig = {
    bloomIntensity: 0.8,
    chromaticAberration: 0.002,
    vignette: 0.35,
    exposure: 1.2,
    toneMapping: THREE.ACESFilmicToneMapping,
  };

  public applyToRenderer(renderer: THREE.WebGLRenderer): void {
    renderer.toneMapping = this.config.toneMapping;
    renderer.toneMappingExposure = this.config.exposure;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
  }

  public updateConfig(newConfig: Partial<PostProcessingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  public getConfig(): PostProcessingConfig {
    return this.config;
  }
}
