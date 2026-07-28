import * as THREE from 'three';

export interface LightingPreset {
  sunColor: string;
  sunIntensity: number;
  ambientColor: string;
  ambientIntensity: number;
  shadowsEnabled: boolean;
  iblIntensity: number;
}

export class LightingEngine {
  private static instance: LightingEngine | null = null;

  private sunLight: THREE.DirectionalLight = new THREE.DirectionalLight(
    0xffffff,
    2.5
  );
  private ambientLight: THREE.AmbientLight = new THREE.AmbientLight(
    0x0e1418,
    0.8
  );
  private hemiLight: THREE.HemisphereLight = new THREE.HemisphereLight(
    0x7df4ff,
    0x0e1418,
    0.6
  );

  private activePreset: LightingPreset = {
    sunColor: '#dbfcff',
    sunIntensity: 2.5,
    ambientColor: '#0e1418',
    ambientIntensity: 0.8,
    shadowsEnabled: true,
    iblIntensity: 1.2,
  };

  private constructor() {
    this.sunLight.position.set(2000, 1500, 3000);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 100;
    this.sunLight.shadow.camera.far = 10000;
    this.sunLight.shadow.camera.left = -3000;
    this.sunLight.shadow.camera.right = 3000;
    this.sunLight.shadow.camera.top = 3000;
    this.sunLight.shadow.camera.bottom = -3000;
    this.sunLight.shadow.bias = -0.0005;
  }

  public static getInstance(): LightingEngine {
    if (!LightingEngine.instance) {
      LightingEngine.instance = new LightingEngine();
    }
    return LightingEngine.instance;
  }

  public getSunLight(): THREE.DirectionalLight {
    return this.sunLight;
  }

  public getAmbientLight(): THREE.AmbientLight {
    return this.ambientLight;
  }

  public getHemiLight(): THREE.HemisphereLight {
    return this.hemiLight;
  }

  public updatePreset(preset: Partial<LightingPreset>): void {
    this.activePreset = { ...this.activePreset, ...preset };
    if (preset.sunColor) this.sunLight.color.set(preset.sunColor);
    if (preset.sunIntensity !== undefined)
      this.sunLight.intensity = preset.sunIntensity;
    if (preset.ambientColor) this.ambientLight.color.set(preset.ambientColor);
    if (preset.ambientIntensity !== undefined)
      this.ambientLight.intensity = preset.ambientIntensity;
    if (preset.shadowsEnabled !== undefined)
      this.sunLight.castShadow = preset.shadowsEnabled;
  }

  public getActivePreset(): LightingPreset {
    return this.activePreset;
  }
}
