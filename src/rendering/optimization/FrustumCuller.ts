import * as THREE from 'three';

export class FrustumCuller {
  private frustum = new THREE.Frustum();
  private projScreenMatrix = new THREE.Matrix4();
  private boundingSphere = new THREE.Sphere();

  /**
   * Update frustum from current camera matrix
   */
  public updateFrustum(camera: THREE.Camera): void {
    this.projScreenMatrix.multiplyMatrices(
      camera.projectionMatrix,
      camera.matrixWorldInverse
    );
    this.frustum.setFromProjectionMatrix(this.projScreenMatrix);
  }

  /**
   * Test if bounding sphere is inside view frustum
   */
  public isSphereInFrustum(
    center: [number, number, number],
    radius: number
  ): boolean {
    this.boundingSphere.set(new THREE.Vector3(...center), radius);
    return this.frustum.intersectsSphere(this.boundingSphere);
  }
}
