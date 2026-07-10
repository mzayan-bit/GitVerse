'use client';

import { useRef } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

const DustMaterial = shaderMaterial(
  {
    uTime: 0,
  },
  // Vertex
  /* glsl */ `
    attribute float size;
    attribute float speed;
    varying float vAlpha;

    uniform float uTime;

    void main() {
      vAlpha = 0.3 + sin(uTime * speed) * 0.2; // Subtle pulsing
      
      vec3 pos = position;
      // Very slow drift upwards
      pos.y += uTime * speed * 2.0;
      
      // Wrap around logic (assuming sphere radius 100)
      if (pos.y > 100.0) pos.y -= 200.0;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  // Fragment
  /* glsl */ `
    varying float vAlpha;
    void main() {
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      if (dist > 0.5) discard;
      
      // Soft blurred edge
      float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
      gl_FragColor = vec4(1.0, 1.0, 1.0, alpha * 0.5);
    }
  `
);

extend({ DustMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dustMaterial: any;
  }
}

const count = 500;
const geo = new THREE.BufferGeometry();
const pos = new Float32Array(count * 3);
const size = new Float32Array(count);
const speed = new Float32Array(count);

for (let i = 0; i < count; i++) {
  const r = 100;
  pos[i * 3] = (Math.random() - 0.5) * r * 2;
  pos[i * 3 + 1] = (Math.random() - 0.5) * r * 2;
  pos[i * 3 + 2] = (Math.random() - 0.5) * r * 2;

  size[i] = 10 + Math.random() * 20; // large out of focus particles
  speed[i] = 0.1 + Math.random() * 0.5;
}

geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
geo.setAttribute('size', new THREE.BufferAttribute(size, 1));
geo.setAttribute('speed', new THREE.BufferAttribute(speed, 1));

export function SpaceDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
    if (pointsRef.current) {
      // Extremely slow rotation
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef} geometry={geo}>
      <dustMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
