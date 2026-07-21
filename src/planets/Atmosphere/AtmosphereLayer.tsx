/* eslint-disable react-hooks/immutability */

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { AtmosphereConfig, TerrainConfig } from '../PlanetTypes';

export interface AtmosphereLayerProps {
  terrain: TerrainConfig;
  atmosphere: AtmosphereConfig;
}

const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPositionNormal = normalize((modelViewMatrix * vec4(position, 1.0)).xyz);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
uniform vec3 uColor;
uniform float uGlowIntensity;
uniform float uScattering;

varying vec3 vNormal;
varying vec3 vPositionNormal;

void main() {
  // Simple fresnel approximation, MUST clamp to prevent NaN with pow()
  float fresnel = max(0.0, uScattering - dot(vNormal, vPositionNormal));
  float intensity = pow(fresnel, uGlowIntensity);
  gl_FragColor = vec4(uColor, 1.0) * intensity;
}
`;

export function AtmosphereLayer({ terrain, atmosphere }: AtmosphereLayerProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: atmosphereVertexShader,
      fragmentShader: atmosphereFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(atmosphere.color) },
        uGlowIntensity: { value: atmosphere.glowIntensity },
        uScattering: { value: atmosphere.scattering },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide, // render on inside of slightly larger sphere
      transparent: true,
      depthWrite: false,
    });
  }, [atmosphere]);

  // Update uniforms if atmosphere config changes
  useMemo(() => {
    if (material.uniforms) {
      material.uniforms.uColor.value.set(atmosphere.color);
      material.uniforms.uGlowIntensity.value = atmosphere.glowIntensity;
      material.uniforms.uScattering.value = atmosphere.scattering;
    }
  }, [atmosphere, material]);

  const radius = terrain.baseRadius * atmosphere.thickness;

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
