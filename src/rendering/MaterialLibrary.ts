import * as THREE from 'three';

export interface MaterialProfile {
  name: string;
  material: THREE.Material;
}

export class MaterialLibrary {
  private static instance: MaterialLibrary | null = null;
  private library: Map<string, THREE.Material> = new Map();

  private constructor() {
    this.initDefaultMaterials();
  }

  public static getInstance(): MaterialLibrary {
    if (!MaterialLibrary.instance) {
      MaterialLibrary.instance = new MaterialLibrary();
    }
    return MaterialLibrary.instance;
  }

  private initDefaultMaterials(): void {
    // Planet Surface PBR Material
    const planetMaterial = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.45,
      metalness: 0.15,
      bumpScale: 0.05,
    });
    this.library.set('planetSurface', planetMaterial);

    // Glass Material
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.9,
      opacity: 1.0,
      transparent: true,
      roughness: 0.1,
      metalness: 0.0,
      ior: 1.5,
      thickness: 0.5,
      clearcoat: 1.0,
    });
    this.library.set('glass', glassMaterial);

    // Metallic Material
    const metallicMaterial = new THREE.MeshStandardMaterial({
      color: 0x7df4ff,
      roughness: 0.15,
      metalness: 0.9,
    });
    this.library.set('metallic', metallicMaterial);

    // Energy Core Material
    const energyCoreMaterial = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: false,
    });
    this.library.set('energyCore', energyCoreMaterial);
  }

  public getMaterial(name: string): THREE.Material {
    return this.library.get(name) || this.library.get('planetSurface')!;
  }

  public registerMaterial(name: string, material: THREE.Material): void {
    this.library.set(name, material);
  }
}
