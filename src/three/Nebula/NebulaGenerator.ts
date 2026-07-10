import * as random from 'maath/random';
import { Color } from 'three';
import type { NebulaLayerConfig } from '@/types/nebula';

export class NebulaGenerator {
  public static generateLayer(config: NebulaLayerConfig): {
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
    opacities: Float32Array;
    rotations: Float32Array;
  } {
    const { count, radius, baseSize, colors: configColors } = config;

    const positions = new Float32Array(count * 3);
    // Use maath for volumetric distribution, but restrict Y to make it feel like a galactic disc
    random.inSphere(positions, { radius });
    for (let i = 0; i < count; i++) {
      positions[i * 3 + 1] *= 0.3; // Flatten the sphere into a disc
    }

    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const opacities = new Float32Array(count);
    const rotations = new Float32Array(count);

    const color1 = new Color(configColors[0]);
    const color2 = new Color(configColors[1]);

    for (let i = 0; i < count; i++) {
      // Interpolate between the two nebula colors
      const mixRatio = Math.random();
      const mixedColor = color1.clone().lerp(color2, mixRatio);

      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;

      // Randomize sizes
      sizes[i] = baseSize * (0.8 + Math.random() * 0.4);

      // Randomize base opacities slightly
      opacities[i] = config.opacity * (0.8 + Math.random() * 0.4);

      // Random initial rotation [0, 2PI]
      rotations[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, opacities, rotations };
  }
}
