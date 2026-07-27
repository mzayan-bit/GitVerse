import { Html } from '@react-three/drei';
import { useInteractionStore } from '@/navigation/interaction/InteractionStore';
import { MovementController } from '../navigation/MovementController';
import * as THREE from 'three';

export interface DistanceLabelProps {
  position: [number, number, number];
  title: string;
  subtitle?: string;
  entityId: string;
}

export function DistanceLabel({
  position,
  title,
  subtitle,
  entityId,
}: DistanceLabelProps) {
  const isSelected = useInteractionStore((s) =>
    s.selectedTargets.includes(entityId)
  );
  const isHovered = useInteractionStore(
    (s) => s.hoveredTarget?.entityId === entityId
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    MovementController.getInstance().flyToTarget({
      entityPosition: new THREE.Vector3(...position),
    });
  };

  return (
    <Html
      position={position}
      center
      distanceFactor={300}
      style={{
        transition: 'all 0.2s ease-out',
        pointerEvents: 'auto',
      }}
    >
      <div
        onClick={handleClick}
        className={`px-3 py-1.5 rounded-lg border backdrop-blur-md cursor-pointer select-none transition-all duration-300 flex flex-col items-center whitespace-nowrap ${
          isSelected
            ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-[0_0_20px_rgba(99,102,241,0.6)] scale-110'
            : isHovered
              ? 'bg-slate-900/80 border-sky-400 text-sky-200 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105'
              : 'bg-black/60 border-white/10 text-gray-300 hover:border-white/30 hover:bg-black/80'
        }`}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold tracking-wide">{title}</span>
        </div>
        {subtitle && (
          <span className="text-[10px] text-gray-400 font-mono mt-0.5">
            {subtitle}
          </span>
        )}
      </div>
    </Html>
  );
}
