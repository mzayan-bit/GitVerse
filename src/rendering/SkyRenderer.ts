import * as THREE from 'three';

export class SkyRenderer {
  public createSkyDome(radius = 15000): THREE.Mesh {
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x090f13,
      side: THREE.BackSide,
    });
    return new THREE.Mesh(geo, mat);
  }
}
