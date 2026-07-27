import { useInteractionStore } from '@/navigation/interaction/InteractionStore';
import { MovementController } from '../navigation/MovementController';
import { Navigation, Eye, Activity, Bookmark, Copy, X } from 'lucide-react';
import * as THREE from 'three';

export function ContextMenu() {
  const contextMenuTarget = useInteractionStore((s) => s.contextMenuTarget);
  const setContextMenu = useInteractionStore((s) => s.setContextMenu);

  if (!contextMenuTarget) return null;

  const handleFlyTo = () => {
    MovementController.getInstance().flyToTarget({
      entityPosition: new THREE.Vector3(...contextMenuTarget.point),
    });
    setContextMenu(null);
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(contextMenuTarget.entityId);
    setContextMenu(null);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-black/85 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl p-2 w-64 text-white animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-1">
          <span className="text-xs font-semibold text-indigo-400 truncate max-w-[180px]">
            {contextMenuTarget.entityId}
          </span>
          <button
            onClick={() => setContextMenu(null)}
            className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <button
            onClick={handleFlyTo}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:bg-indigo-600/30 hover:text-indigo-300 transition-all text-left"
          >
            <Navigation className="w-4 h-4 text-indigo-400" />
            <span>Fly To Repository</span>
          </button>
          <button
            onClick={() => setContextMenu(null)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:bg-white/10 hover:text-white transition-all text-left"
          >
            <Eye className="w-4 h-4 text-sky-400" />
            <span>Inspect Architecture</span>
          </button>
          <button
            onClick={() => setContextMenu(null)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:bg-white/10 hover:text-white transition-all text-left"
          >
            <Activity className="w-4 h-4 text-amber-400" />
            <span>Simulate Impact</span>
          </button>
          <button
            onClick={() => setContextMenu(null)}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-200 hover:bg-white/10 hover:text-white transition-all text-left"
          >
            <Bookmark className="w-4 h-4 text-emerald-400" />
            <span>Add Bookmark</span>
          </button>

          <hr className="border-white/10 my-1" />

          <button
            onClick={handleCopyId}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all text-left"
          >
            <Copy className="w-4 h-4 text-gray-400" />
            <span>Copy Repository ID</span>
          </button>
        </div>
      </div>
    </div>
  );
}
