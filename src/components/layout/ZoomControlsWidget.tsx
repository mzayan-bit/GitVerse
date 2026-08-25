import { Plus, Minus, RotateCcw } from 'lucide-react';
import { useCameraRig } from '@/navigation/camera/CameraRig';
import * as THREE from 'three';

export function ZoomControlsWidget() {
  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const state = useCameraRig.getState();
    const currentPos = state.goalPosition.clone();
    const target = state.goalTarget.clone();
    const dir = currentPos.sub(target);
    const dist = dir.length();
    const newDist = Math.max(20, dist * 0.75);
    const newPos = target.clone().add(dir.normalize().multiplyScalar(newDist));

    useCameraRig.setState({
      position: newPos.clone(),
      goalPosition: newPos.clone(),
      target: target.clone(),
      goalTarget: target.clone(),
    });
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const state = useCameraRig.getState();
    const currentPos = state.goalPosition.clone();
    const target = state.goalTarget.clone();
    const dir = currentPos.sub(target);
    const dist = dir.length();
    const newDist = Math.min(15000, dist * 1.35);
    const newPos = target.clone().add(dir.normalize().multiplyScalar(newDist));

    useCameraRig.setState({
      position: newPos.clone(),
      goalPosition: newPos.clone(),
      target: target.clone(),
      goalTarget: target.clone(),
    });
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const defaultPos = new THREE.Vector3(0, 400, 800);
    const defaultTarget = new THREE.Vector3(0, 0, 0);
    useCameraRig.setState({
      position: defaultPos.clone(),
      goalPosition: defaultPos.clone(),
      target: defaultTarget.clone(),
      goalTarget: defaultTarget.clone(),
    });
  };

  return (
    <div
      aria-label="3D Viewport Navigation Controls"
      className="fixed bottom-6 left-20 z-50 flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0B0F17]/95 backdrop-blur-2xl border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.8)] font-sans select-none pointer-events-auto"
    >
      <button
        onClick={handleZoomIn}
        type="button"
        aria-label="Zoom In"
        title="Zoom In (+)"
        className="p-2.5 rounded-xl bg-white/10 hover:bg-purple-600/50 active:bg-purple-600 text-white transition-all cursor-pointer shadow-sm"
      >
        <Plus className="w-4 h-4 text-purple-300" />
      </button>

      <button
        onClick={handleZoomOut}
        type="button"
        aria-label="Zoom Out"
        title="Zoom Out (-)"
        className="p-2.5 rounded-xl bg-white/10 hover:bg-purple-600/50 active:bg-purple-600 text-white transition-all cursor-pointer shadow-sm"
      >
        <Minus className="w-4 h-4 text-purple-300" />
      </button>

      <div className="h-4 w-px bg-white/20 mx-0.5" />

      <button
        onClick={handleReset}
        type="button"
        aria-label="Reset Camera View"
        title="Reset 3D View"
        className="p-2.5 rounded-xl bg-white/10 hover:bg-cyan-600/50 active:bg-cyan-600 text-white transition-all cursor-pointer shadow-sm"
      >
        <RotateCcw className="w-4 h-4 text-cyan-300" />
      </button>
    </div>
  );
}
