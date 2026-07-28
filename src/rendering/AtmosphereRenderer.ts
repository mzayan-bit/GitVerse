import * as THREE from 'three';
import { createAtmosphereMaterial } from './environment/PlanetAtmosphereMaterial';

export class AtmosphereRenderer {
  public createAtmosphereMesh(radius: number, color = '#00f0ff'): THREE.Mesh {
    const geo = new THREE.SphereGeometry(radius * 1.15, 32, 32);
    const mat = createAtmosphereMaterial(color, 1.2);
    return new THREE.Mesh(geo, mat);
  }
}
