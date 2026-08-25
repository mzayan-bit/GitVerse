import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useCameraRig } from '@/navigation/camera/CameraRig';
import * as THREE from 'three';

export function ZoomControlsWidget() {
  const handleZoomIn = () => {
    const state = useCameraRig.getState();
    const currentPos = state.goalPosition.clone();
    const target = state.goalTarget.clone();
    const dir = currentPos.sub(target);
    const newDist = Math.max(15, dir.length() * 0.7);
    const newPos = target.clone().add(dir.normalize().multiplyScalar(newDist));

    useCameraRig.setState({
      goalPosition: newPos,
    });
  };

  const handleZoomOut = () => {
    const state = useCameraRig.getState();
    const currentPos = state.goalPosition.clone();
    const target = state.goalTarget.clone();
    const dir = currentPos.sub(target);
    const newDist = Math.min(15000, dir.length() * 1.4);
    const newPos = target.clone().add(dir.normalize().multiplyScalar(newDist));

    useCameraRig.setState({
      goalPosition: newPos,
    });
  };

  const handleReset = () => {
    useCameraRig.setState({
      goalPosition: new THREE.Vector3(0, 400, 800),
      goalTarget: new THREE.Vector3(0, 0, 0),
    });
  };

  return (
    <div
      aria-label="3D Viewport Controls"
      className="fixed bottom-6 right-6 z-30 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B0F17]/90 backdrop-blur-2xl border border-white/10 shadow-2xl font-sans select-none"
    >
      <button
        onClick={handleZoomIn}
        aria-label="Zoom In"
        title="Zoom In (+)"
        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all active:scale-95"
      >
        <Plus className="w-4 h-4 text-purple-400" />
      </button>

      <button
        onClick={handleZoomOut}
        aria-label="Zoom Out"
        title="Zoom Out (-)"
        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all active:scale-95"
      >
        <Minus className="w-4 h-4 text-purple-400" />
      </button>

      <div className="h-4 w-px bg-white/10 mx-0.5" />

      <button
        onClick={handleReset}
        aria-label="Reset Camera View"
        title="Reset 3D View"
        className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-all active:scale-95"
      >
        <RotateCcw className="w-4 h-4 text-cyan-400" />
      </button>
    </div>
  );
}
