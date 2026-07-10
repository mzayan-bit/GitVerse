import * as random from 'maath/random';
import { Color } from 'three';
import type { StarLayerConfig } from '@/types/stars';

/**
 * Procedurally generates deterministic star field data.
 */
export class StarGenerator {
  /**
   * Approximates a color from a given temperature in Kelvin.
   */
  private static kelvinToColor(kelvin: number): Color {
    // Simple blackbody approximation for star colors (3000K to 10000K)
    const temp = kelvin / 100;
    let r, g, b;

    if (temp <= 66) {
      r = 255;
      g = temp;
      g = 99.4708025861 * Math.log(g) - 161.1195681661;

      if (temp <= 19) {
        b = 0;
      } else {
        b = temp - 10;
        b = 138.5177312231 * Math.log(b) - 305.0447927307;
      }
    } else {
      r = temp - 60;
      r = 329.698727446 * Math.pow(r, -0.1332047592);
      g = temp - 60;
      g = 288.1221695283 * Math.pow(g, -0.0755148492);
      b = 255;
    }

    return new Color(
      Math.min(255, Math.max(0, r)) / 255,
      Math.min(255, Math.max(0, g)) / 255,
      Math.min(255, Math.max(0, b)) / 255
    );
  }

  /**
   * Generates position, color, size, and twinkle data for a given layer.
   */
  public static generateLayer(
    config: StarLayerConfig,
    colorTempRange: [number, number]
  ): {
    positions: Float32Array;
    colors: Float32Array;
    sizes: Float32Array;
    twinklePhases: Float32Array;
  } {
    const { count, radius, baseSize } = config;

    // Using maath to uniformly distribute points in a sphere
    const positions = new Float32Array(count * 3);
    random.inSphere(positions, { radius });

    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const twinklePhases = new Float32Array(count);

    const [minTemp, maxTemp] = colorTempRange;

    for (let i = 0; i < count; i++) {
      // Random temperature for star color
      const temp = minTemp + Math.random() * (maxTemp - minTemp);
      const color = this.kelvinToColor(temp);

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      // Random size variance based on base size
      sizes[i] = baseSize * (0.5 + Math.random() * 1.5);

      // Random phase for independent twinkling [0, 2PI]
      twinklePhases[i] = Math.random() * Math.PI * 2;
    }

    return { positions, colors, sizes, twinklePhases };
  }
}
