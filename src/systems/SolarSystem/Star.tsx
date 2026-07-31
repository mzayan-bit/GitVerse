import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { StarConfig } from './SolarSystemTypes';

export interface StarProps {
  config: StarConfig;
}

export function Star({ config }: StarProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  // A star slowly rotates
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.01;
    }
  });

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          // Reset focus and switch back to orbit mode at center
          import('./SolarSystemManager').then(({ useSolarSystemManager }) => {
            const state = useSolarSystemManager.getState();
            state.setFocusedPlanetId(null);
            state.setCameraMode('orbit');
          });
        }}
        onPointerOver={() => {
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[config.radius, 64, 64]} />
        {/* We use MeshBasicMaterial because a star emits light and doesn't receive shadows/shading.
            We boost color values beyond 1.0 (if possible) or rely on the post-processing Bloom
            pass to catch the bright color. Here we just set color and toneMapped=false so it stays bright. */}
        <meshBasicMaterial
          color={new THREE.Color(config.color).multiplyScalar(config.emission)}
          toneMapped={false}
        />
      </mesh>

      {/* 
        PointLight for the solar system.
        Intensity is scaled based on emission.
        Distance is large enough to cover the system (e.g. 5000).
        Decay matches physical falloff (2).
      */}
      <pointLight
        color={config.color}
        intensity={config.emission * 1000} // High intensity for physically correct lighting
        distance={10000}
        decay={2}
        castShadow
      />
    </group>
  );
}
