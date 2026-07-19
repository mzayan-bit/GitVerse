import * as THREE from 'three';
import { TerrainConfig } from '../PlanetTypes';
import { PlanetCache } from '../Utilities/Cache';

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
    const cacheKey = `geo_${config.baseRadius}_${lodLevel}`;
    const cached = PlanetCache.getGeometry(cacheKey);
    if (cached) return cached;

    let segments = 128;
    if (lodLevel === 'medium') segments = 64;
    if (lodLevel === 'low') segments = 32;

    const geometry = new THREE.SphereGeometry(
      config.baseRadius,
      segments,
      segments
    );

    // Compute tangents for normal mapping / bump mapping
    geometry.computeTangents();
    PlanetCache.setGeometry(cacheKey, geometry);

    return geometry;
  }
}
