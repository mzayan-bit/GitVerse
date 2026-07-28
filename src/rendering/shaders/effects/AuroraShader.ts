import * as THREE from 'three';

export function createAuroraMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color('#00f0ff') },
      uColor2: { value: new THREE.Color('#e9b3ff') },
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
      uniform vec3 uColor1;
      uniform vec3 uColor2;
      varying vec2 vUv;
      void main() {
        float wave = sin(vUv.x * 12.0 + uTime * 3.0) * 0.5 + 0.5;
        vec3 col = mix(uColor1, uColor2, wave);
        float alpha = sin(vUv.y * 3.14159) * 0.4 * wave;
        gl_FragColor = vec4(col, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
  });
}
