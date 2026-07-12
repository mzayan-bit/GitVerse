import * as THREE from 'three';
import { PlanetConfig } from '../PlanetTypes';
import { GLSL_SIMPLEX_NOISE_3D } from '../Shaders/Noise';
import { PlanetCache } from '../Utilities/Cache';

export class PlanetMaterialBuilder {
  static build(config: PlanetConfig): THREE.MeshStandardMaterial {
    // Generate a hash based on type and seed for caching
    const cacheKey = `mat_${config.type}_${config.seed.value}`;
    const cached = PlanetCache.getMaterial(
      cacheKey
    ) as THREE.MeshStandardMaterial;
    if (cached) return cached;

    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(config.material.colorPalette[0] || '#ffffff'),
      roughness: config.material.roughness,
      metalness: config.material.metalness,
      wireframe: false,
    });

    if (config.material.emissionColor) {
      material.emissive = new THREE.Color(config.material.emissionColor);
      material.emissiveIntensity = config.material.emissionIntensity || 1;
    }

    // Convert colors to vec3 strings for the shader
    const colorPaletteStr = config.material.colorPalette.map((c) => {
      const col = new THREE.Color(c);
      return `vec3(${col.r.toFixed(4)}, ${col.g.toFixed(4)}, ${col.b.toFixed(4)})`;
    });

    // Fill up to 4 colors for safety
    while (colorPaletteStr.length < 4) {
      colorPaletteStr.push(colorPaletteStr[colorPaletteStr.length - 1]);
    }

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uDisplacementStrength = {
        value: config.terrain.displacementStrength,
      };
      shader.uniforms.uNoiseScale = { value: config.terrain.noiseScale };
      shader.uniforms.uOctaves = { value: config.terrain.octaves };
      shader.uniforms.uPersistence = { value: config.terrain.persistence };
      shader.uniforms.uLacunarity = { value: config.terrain.lacunarity };

      // Vertex Shader Injection
      shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
        #include <common>
        uniform float uDisplacementStrength;
        uniform float uNoiseScale;
        uniform int uOctaves;
        uniform float uPersistence;
        uniform float uLacunarity;

        varying float vNoise;
        varying vec3 vWorldPosition;

        ${GLSL_SIMPLEX_NOISE_3D}
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        
        vec3 scaledPos = position * uNoiseScale;
        float noiseVal = fbm(scaledPos, uOctaves, uPersistence, uLacunarity);
        vNoise = noiseVal;
        
        // Displace along normal
        transformed += normal * noiseVal * uDisplacementStrength;
        
        vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
        `
      );

      // Fragment Shader Injection
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
        #include <common>
        varying float vNoise;
        varying vec3 vWorldPosition;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <color_fragment>',
        `
        #include <color_fragment>
        
        // Simple color mapping based on noise elevation
        vec3 col0 = ${colorPaletteStr[0]};
        vec3 col1 = ${colorPaletteStr[1]};
        vec3 col2 = ${colorPaletteStr[2]};
        vec3 col3 = ${colorPaletteStr[3]};
        
        // Map noise (-1 to 1 approx) to 0-1
        float n = clamp(vNoise * 0.5 + 0.5, 0.0, 1.0);
        
        vec3 finalColor;
        if(n < 0.33) {
          finalColor = mix(col0, col1, smoothstep(0.0, 0.33, n));
        } else if(n < 0.66) {
          finalColor = mix(col1, col2, smoothstep(0.33, 0.66, n));
        } else {
          finalColor = mix(col2, col3, smoothstep(0.66, 1.0, n));
        }
        
        diffuseColor.rgb = finalColor;
        `
      );
    };

    PlanetCache.setMaterial(cacheKey, material);
    return material;
  }
}
