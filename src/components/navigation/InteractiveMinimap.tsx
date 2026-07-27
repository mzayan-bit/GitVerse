import { useState } from 'react';
import { useCameraRig } from '@/navigation/camera/CameraRig';
import { MovementController } from '@/engine/navigation/MovementController';
import { Compass, Maximize2, Minimize2 } from 'lucide-react';
import * as THREE from 'three';

export interface MinimapNode {
  id: string;
  name: string;
  position: [number, number, number];
  color?: string;
}

interface InteractiveMinimapProps {
  nodes?: MinimapNode[];
}

export function InteractiveMinimap({ nodes = [] }: InteractiveMinimapProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const cameraPos = useCameraRig((s) => s.position);
  const cameraTarget = useCameraRig((s) => s.target);

  // Map 3D coordinates to 2D radar space
  const radarScale = 0.05;
  const size = isExpanded ? 220 : 140;
  const center = size / 2;

  // Calculate compass angle
  const dir = new THREE.Vector3()
    .subVectors(cameraTarget, cameraPos)
    .normalize();
  const angleRad = Math.atan2(dir.x, dir.z);
  const angleDeg = (angleRad * 180) / Math.PI;

  const handleNodeClick = (node: MinimapNode) => {
    MovementController.getInstance().flyToTarget({
      entityPosition: new THREE.Vector3(...node.position),
    });
  };

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl transition-all duration-300 overflow-hidden ${
        isExpanded ? 'w-[220px] h-[220px]' : 'w-[140px] h-[140px]'
      }`}
    >
      {/* Header */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-indigo-400 font-bold">
          <Compass
            className="w-3.5 h-3.5 animate-spin-slow"
            style={{ transform: `rotate(${angleDeg}deg)` }}
          />
          <span>RADAR</span>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-400 hover:text-white p-0.5 rounded transition-colors"
        >
          {isExpanded ? (
            <Minimize2 className="w-3 h-3" />
          ) : (
            <Maximize2 className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Radar Canvas / Map Grid */}
      <div className="relative w-full h-full flex items-center justify-center pt-4">
        {/* Radar Rings */}
        <div className="absolute inset-4 rounded-full border border-indigo-500/20" />
        <div className="absolute inset-10 rounded-full border border-indigo-500/10" />

        {/* Camera Indicator */}
        <div
          className="absolute w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_12px_#6366f1] z-20"
          style={{
            left: `${center + cameraPos.x * radarScale - 6}px`,
            top: `${center + cameraPos.z * radarScale - 6}px`,
          }}
        >
          {/* FOV Cone Pointer */}
          <div
            className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-indigo-400 absolute -top-2 left-1/2 -translate-x-1/2 origin-bottom"
            style={{ transform: `rotate(${angleDeg}deg)` }}
          />
        </div>

        {/* Planet Nodes */}
        {nodes.map((node) => {
          const nx = center + node.position[0] * radarScale;
          const ny = center + node.position[2] * radarScale;

          // Only show if inside map bounds
          if (nx < 10 || nx > size - 10 || ny < 10 || ny > size - 10)
            return null;

          return (
            <button
              key={node.id}
              onClick={() => handleNodeClick(node)}
              title={node.name}
              className="absolute w-2 h-2 rounded-full bg-emerald-400 hover:scale-150 transition-transform cursor-pointer shadow-[0_0_8px_#34d399]"
              style={{ left: `${nx - 4}px`, top: `${ny - 4}px` }}
            />
          );
        })}
      </div>
    </div>
  );
}
