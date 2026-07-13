import { shaderMaterial } from '@react-three/drei';

export const NebulaMaterial = shaderMaterial(
  {
    uTime: 0,
    uNoiseScale: 0.01,
  },
  // Vertex Shader
  /* glsl */ `
    attribute vec3 aColor;
    attribute float size;
    attribute float opacity;
    attribute float rotation;
    
    varying vec3 vParticleColor;
    varying float vOpacity;
    varying float vRotation;

    void main() {
      vParticleColor = aColor;
      vOpacity = opacity;
      vRotation = rotation;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  /* glsl */ `
    uniform float uTime;
    uniform float uNoiseScale;

    varying vec3 vParticleColor;
    varying float vOpacity;
    varying float vRotation;

    // Simple 2D noise for organic feeling
    vec2 random2(vec2 st){
        st = vec2( dot(st,vec2(127.1,311.7)),
                  dot(st,vec2(269.5,183.3)) );
        return -1.0 + 2.0*fract(sin(st)*43758.5453123);
    }
    
    float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        vec2 u = f*f*(3.0-2.0*f);
        return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                         dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                    mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                         dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
    }

    void main() {
      // Shift coordinate system to center
      vec2 coord = gl_PointCoord - vec2(0.5);

      // Apply rotation
      float s = sin(vRotation + uTime * 0.1);
      float c = cos(vRotation + uTime * 0.1);
      mat2 rot = mat2(c, -s, s, c);
      coord = rot * coord;
      
      // Calculate distance to center
      float dist = length(coord);
      
      // Very soft edge
      if (dist > 0.5) discard;
      float alpha = smoothstep(0.5, 0.0, dist);

      // Add noise to make it feel cloudy
      float n = noise((coord + uTime * uNoiseScale) * 10.0);
      alpha *= (0.6 + 0.4 * n);

      gl_FragColor = vec4(vParticleColor, alpha * vOpacity);
    }
  `
);
