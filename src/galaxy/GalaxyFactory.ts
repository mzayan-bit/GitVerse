import * as THREE from 'three';
import { GalaxyConfig } from './GalaxyTypes';

export class GalaxyFactory {
  /**
   * Pre-generates Float32Arrays for InstancedMesh or Points rendering
   * to avoid object creation overhead per-frame.
   */
  public static createGalaxyGeometryData(config: GalaxyConfig) {
    const systemCount = config.systems.length;

    // Positions: x, y, z
    const positions = new Float32Array(systemCount * 3);
    // Colors: r, g, b
    const colors = new Float32Array(systemCount * 3);
    // Sizes: single float
    const sizes = new Float32Array(systemCount);

    const colorHelper = new THREE.Color();

    for (let i = 0; i < systemCount; i++) {
      const sys = config.systems[i];

      positions[i * 3 + 0] = sys.position[0];
      positions[i * 3 + 1] = sys.position[1];
      positions[i * 3 + 2] = sys.position[2];

      colorHelper.set(sys.color);
      colors[i * 3 + 0] = colorHelper.r;
      colors[i * 3 + 1] = colorHelper.g;
      colors[i * 3 + 2] = colorHelper.b;

      sizes[i] = sys.size;
    }

    return {
      positions,
      colors,
      sizes,
      systemCount,
    };
  }
}
