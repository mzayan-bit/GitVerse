import { Globe } from 'lucide-react';
import { useCameraRig } from '@/navigation/camera/CameraRig';

export function UniverseInspectorPanel() {
  const mode = useCameraRig((s) => s.mode);
  const position = useCameraRig((s) => s.position);

  return (
    <div className="space-y-4 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-indigo-400">
        <Globe className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Camera Coordinates
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 font-mono text-[11px]">
        <div className="p-2 rounded bg-white/5 border border-white/5">
          <span className="text-gray-500 block text-[9px]">X</span>
          <span className="text-white font-bold">{Math.round(position.x)}</span>
        </div>
        <div className="p-2 rounded bg-white/5 border border-white/5">
          <span className="text-gray-500 block text-[9px]">Y</span>
          <span className="text-white font-bold">{Math.round(position.y)}</span>
        </div>
        <div className="p-2 rounded bg-white/5 border border-white/5">
          <span className="text-gray-500 block text-[9px]">Z</span>
          <span className="text-white font-bold">{Math.round(position.z)}</span>
        </div>
      </div>

      <div className="p-3 rounded-lg border border-white/5 bg-white/5 flex items-center justify-between">
        <span className="text-gray-400">Active Mode</span>
        <span className="font-mono uppercase font-bold text-sky-400">
          {mode}
        </span>
      </div>
    </div>
  );
}
