import * as THREE from 'three';

export function createSelectionHaloMaterial(color = '#00f0ff') {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        vec2 center = vUv - 0.5;
        float dist = length(center);
        float ring = smoothstep(0.48, 0.49, dist) - smoothstep(0.49, 0.50, dist);
        float pulse = 0.8 + 0.2 * sin(uTime * 4.0);
        gl_FragColor = vec4(uColor, ring * pulse);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}
