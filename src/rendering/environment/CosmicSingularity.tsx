import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CosmicSingularityProps {
  type: 'BlackHole' | 'Pulsar' | 'Quasar';
  position: [number, number, number];
  size?: number;
}

export function CosmicSingularity({
  type,
  position,
  size = 50,
}: CosmicSingularityProps) {
  const diskRef = useRef<THREE.Mesh>(null);
  const jetRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (diskRef.current) {
      diskRef.current.rotation.z += delta * 0.8;
    }
    if (jetRef.current && (type === 'Pulsar' || type === 'Quasar')) {
      jetRef.current.rotation.y += delta * 6.0;
    }
  });

  return (
    <group position={position}>
      {/* Event Horizon / Core */}
      <mesh>
        <sphereGeometry args={[size * 0.6, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Gravitational Accretion Disk */}
      <mesh ref={diskRef} rotation-x={Math.PI / 2}>
        <ringGeometry args={[size * 0.7, size * 2.2, 64]} />
        <meshBasicMaterial
          color={
            type === 'BlackHole'
              ? '#00f0ff'
              : type === 'Pulsar'
                ? '#e9b3ff'
                : '#ffab00'
          }
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Relativistic Jets for Pulsars and Quasars */}
      {(type === 'Pulsar' || type === 'Quasar') && (
        <group ref={jetRef}>
          {/* Top Jet */}
          <mesh position={[0, size * 2, 0]}>
            <cylinderGeometry args={[size * 0.1, size * 0.4, size * 4, 16]} />
            <meshBasicMaterial
              color={type === 'Pulsar' ? '#e9b3ff' : '#ffd296'}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          {/* Bottom Jet */}
          <mesh position={[0, -size * 2, 0]}>
            <cylinderGeometry args={[size * 0.4, size * 0.1, size * 4, 16]} />
            <meshBasicMaterial
              color={type === 'Pulsar' ? '#e9b3ff' : '#ffd296'}
              transparent
              opacity={0.7}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
