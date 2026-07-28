/* eslint-disable react-hooks/immutability */
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PlanetData } from '@/engine/universe/PlanetFactory';
import { createAtmosphereMaterial } from './PlanetAtmosphereMaterial';

interface ProceduralPlanetMeshProps {
  planet: PlanetData;
}

export function ProceduralPlanetMesh({ planet }: ProceduralPlanetMeshProps) {
  const planetRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const atmosphereMat = useMemo(() => {
    return createAtmosphereMaterial(planet.atmosphereColor, 1.2);
  }, [planet.atmosphereColor]);

  useFrame((_, delta) => {
    if (planetRef.current) {
      planetRef.current.rotation.y += delta * 0.2;
    }
    if (cloudRef.current) {
      cloudRef.current.rotation.y += delta * 0.28;
    }
    if (atmosphereMat.uniforms.uTime) {
      atmosphereMat.uniforms.uTime.value += delta;
    }
  });

  return (
    <group position={planet.position}>
      {/* Central Planet Sphere */}
      <group ref={planetRef}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[planet.baseRadius, 32, 32]} />
          <meshStandardMaterial
            color={planet.color}
            roughness={0.5}
            metalness={0.2}
            emissive={planet.glowColor}
            emissiveIntensity={planet.healthScore > 0.8 ? 0.25 : 0.05}
          />
        </mesh>

        {/* Cloud Layer */}
        <mesh ref={cloudRef}>
          <sphereGeometry args={[planet.baseRadius * 1.03, 32, 32]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.3}
            roughness={1.0}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Planet Rings */}
        {planet.hasRings && (
          <mesh rotation-x={Math.PI / 2.5}>
            <ringGeometry
              args={[planet.baseRadius * 1.4, planet.baseRadius * 2.2, 64]}
            />
            <meshStandardMaterial
              color={planet.ringColor || '#7df4ff'}
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>
        )}
      </group>

      {/* Outer Atmosphere Fresnel Shield */}
      <mesh ref={atmosphereRef} material={atmosphereMat}>
        <sphereGeometry args={[planet.baseRadius * 1.15, 32, 32]} />
      </mesh>

      {/* Render Moons (Branches) */}
      {planet.moons.map((moon, idx) => (
        <group key={moon.id} rotation-y={(idx * Math.PI) / 3}>
          <mesh position={[moon.orbitRadius, 0, 0]}>
            <sphereGeometry args={[moon.radius, 16, 16]} />
            <meshStandardMaterial color={moon.color} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Render Satellites (Deployments) */}
      {planet.satellites.map((sat, idx) => (
        <group key={sat.id} rotation-x={(idx * Math.PI) / 2}>
          <mesh position={[sat.orbitRadius, 0, 0]}>
            <boxGeometry args={[3, 3, 3]} />
            <meshBasicMaterial color={sat.color} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
