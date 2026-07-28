import * as THREE from 'three';

export function createWarpTravelMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uSpeed: { value: 2.0 },
      uColor: { value: new THREE.Color('#00f0ff') },
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
      uniform float uSpeed;
      uniform vec3 uColor;
      varying vec2 vUv;
      void main() {
        vec2 p = vUv - 0.5;
        float r = length(p);
        float a = atan(p.y, p.x);
        float streak = sin(a * 20.0 + uTime * uSpeed * 10.0) * 0.5 + 0.5;
        float alpha = smoothstep(0.5, 0.0, r) * streak * 0.8;
        gl_FragColor = vec4(uColor, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
}
