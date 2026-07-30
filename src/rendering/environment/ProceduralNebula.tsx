import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Ultra-optimized 60 FPS Procedural Cosmic Nebula.
 * Uses lightweight vertex noise and fast fragment blending.
 */
export function ProceduralNebula() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorA: { value: new THREE.Color('#1e1b4b') }, // Soft indigo
        uColorB: { value: new THREE.Color('#0f172a') }, // Soft slate navy
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying vec2 vUv;
        varying vec3 vNormal;

        void main() {
          float noise = sin(vUv.x * 6.0 + uTime * 0.2) * cos(vUv.y * 6.0 + uTime * 0.15);
          vec3 color = mix(uColorA, uColorB, noise * 0.5 + 0.5);
          float rim = 1.0 - max(0.0, dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float alpha = smoothstep(0.1, 0.9, rim) * 0.12;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
  }, []);

  useFrame((_, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.002;
    }
  });

  return (
    <mesh ref={meshRef} material={shaderMaterial}>
      <sphereGeometry args={[12000, 32, 32]} />
    </mesh>
  );
}
