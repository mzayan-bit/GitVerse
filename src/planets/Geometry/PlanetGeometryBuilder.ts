import * as THREE from 'three';
import { TerrainConfig } from '../PlanetTypes';

export class PlanetGeometryBuilder {
  /**
   * Generates a base sphere geometry with the required LOD segments.
   * Displacement happens in the vertex shader for performance,
   * but we provide enough subdivisions based on LOD preference.
   */
  static build(
    config: TerrainConfig,
    lodLevel: 'high' | 'medium' | 'low' = 'high'
  ): THREE.BufferGeometry {
    let segments = 256;
    if (lodLevel === 'medium') segments = 128;
    if (lodLevel === 'low') segments = 64;

    const geometry = new THREE.SphereGeometry(
      config.baseRadius,
      segments,
      segments
    );

    // Compute tangents for normal mapping / bump mapping
    geometry.computeTangents();

    return geometry;
  }
}
