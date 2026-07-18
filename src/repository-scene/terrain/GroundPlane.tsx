'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { CityLayout, District } from './TerrainTypes';

interface GroundPlaneProps {
  layout: CityLayout;
}

/**
 * Renders the ground plane for the repository city.
 * Includes subtle grid lines and district boundary indicators.
 */
export function GroundPlane({ layout }: GroundPlaneProps) {
  const { groundRadius, districts } = layout;

  const gridTexture = useMemo(() => {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d')!;

    // Background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, size, size);

    // Grid lines
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.08)';
    ctx.lineWidth = 1;
    const step = size / 32;
    for (let i = 0; i <= 32; i++) {
      ctx.beginPath();
      ctx.moveTo(i * step, 0);
      ctx.lineTo(i * step, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * step);
      ctx.lineTo(size, i * step);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(groundRadius / 50, groundRadius / 50);
    return tex;
  }, [groundRadius]);

  return (
    <group>
      {/* Main ground plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.1, 0]}
        receiveShadow
      >
        <circleGeometry args={[groundRadius, 64]} />
        <meshStandardMaterial
          map={gridTexture}
          color="#0d0d14"
          roughness={0.95}
          metalness={0.1}
        />
      </mesh>

      {/* District markers — subtle glowing circles */}
      {districts.map((district) => (
        <DistrictMarker key={district.id} district={district} />
      ))}

      {/* Ambient ground glow */}
      <pointLight
        position={[0, 5, 0]}
        color="#1e40af"
        intensity={0.3}
        distance={groundRadius * 2}
      />
    </group>
  );
}

function DistrictMarker({ district }: { district: District }) {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[district.position[0], 0.01, district.position[2]]}
    >
      <ringGeometry args={[district.radius - 1, district.radius, 48]} />
      <meshBasicMaterial
        color={district.color}
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
