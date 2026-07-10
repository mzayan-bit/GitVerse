import { shaderMaterial } from '@react-three/drei';

export const StarMaterial = shaderMaterial(
  {
    uTime: 0,
    uTwinkleSpeed: 1.0,
    uTwinkleFactor: 0.5,
    uOpacity: 1.0,
  },
  // Vertex Shader
  /* glsl */ `
    attribute float size;
    attribute float twinklePhase;
    
    varying vec3 vColor;
    varying float vTwinklePhase;

    void main() {
      vColor = color;
      vTwinklePhase = twinklePhase;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      // Perspective size scaling
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment Shader
  /* glsl */ `
    uniform float uTime;
    uniform float uTwinkleSpeed;
    uniform float uTwinkleFactor;
    uniform float uOpacity;

    varying vec3 vColor;
    varying float vTwinklePhase;

    void main() {
      // Circular soft particle
      vec2 xy = gl_PointCoord.xy - vec2(0.5);
      float ll = length(xy);
      if (ll > 0.5) discard;
      
      // Soft glow edge
      float alpha = (0.5 - ll) * 2.0;
      
      // Twinkle calculation
      float twinkle = sin(uTime * uTwinkleSpeed + vTwinklePhase) * 0.5 + 0.5;
      // Mix between base alpha and twinkling alpha based on twinkle factor
      float finalAlpha = alpha * mix(1.0, twinkle, uTwinkleFactor) * uOpacity;

      gl_FragColor = vec4(vColor, finalAlpha);
    }
  `
);
