import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { AtmosphereConfig, TerrainConfig } from '../PlanetTypes';
import { GLSL_SIMPLEX_NOISE_3D } from '../Shaders/Noise';

export interface CloudLayerProps {
  terrain: TerrainConfig;
  atmosphere: AtmosphereConfig;
}

const cloudVertexShader = `
varying vec3 vPosition;
void main() {
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const cloudFragmentShader = `
uniform float uTime;
uniform float uOpacity;
varying vec3 vPosition;

${GLSL_SIMPLEX_NOISE_3D}

void main() {
  vec3 pos = vPosition * 0.2 + vec3(uTime * 0.05);
  float noise = fbm(pos, 3, 0.5, 2.0);
  
  float alpha = smoothstep(0.4, 0.7, noise) * uOpacity;
  if(alpha < 0.01) discard;
  
  gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
}
`;

export function CloudLayer({ terrain, atmosphere }: CloudLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: cloudVertexShader,
      fragmentShader: cloudFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: atmosphere.cloudOpacity ?? 0.8 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });
  }, [atmosphere.cloudOpacity]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * (atmosphere.cloudSpeed ?? 0.005);
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }
  });

  const radius = terrain.baseRadius * 1.01;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive ref={materialRef} object={material} attach="material" />
    </mesh>
  );
}
