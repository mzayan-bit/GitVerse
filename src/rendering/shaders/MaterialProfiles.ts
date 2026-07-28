import * as THREE from 'three';

export class MaterialProfiles {
  public static createObsidianMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0x090f13,
      roughness: 0.1,
      metalness: 0.8,
    });
  }

  public static createGasGiantMaterial(
    color = '#e9b3ff'
  ): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color,
      roughness: 0.6,
      metalness: 0.1,
    });
  }

  public static createCrystalCoreMaterial(): THREE.MeshPhysicalMaterial {
    return new THREE.MeshPhysicalMaterial({
      color: 0x00f0ff,
      transmission: 0.85,
      roughness: 0.05,
      ior: 1.6,
      thickness: 1.2,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.4,
    });
  }

  public static createNeonPlasmaMaterial(
    color = '#ff0055'
  ): THREE.MeshBasicMaterial {
    return new THREE.MeshBasicMaterial({
      color,
      wireframe: false,
    });
  }

  public static createChromeHullMaterial(): THREE.MeshStandardMaterial {
    return new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 1.0,
      roughness: 0.05,
    });
  }
}
