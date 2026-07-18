'use client';

import {
  ChevronRight,
  FolderOpen,
  Home,
  Eye,
  Globe2,
  Move3D,
  User,
  Camera,
} from 'lucide-react';
import { useRepositoryScene } from '../SceneManager';
import { ExploreCameraMode } from '../SceneState';

/**
 * Premium floating HUD for repository exploration.
 * Shows breadcrumbs, stats, camera mode selector, and back button.
 */
export function RepositoryExplorerHUD() {
  const {
    mode,
    activeRepository,
    currentPath,
    selectedBuilding,
    cameraMode,
    setCameraMode,
    navigateTo,
    navigateUp,
    leaveRepository,
  } = useRepositoryScene();

  if (mode !== 'exploring' || !activeRepository) return null;

  const cameraModes: {
    mode: ExploreCameraMode;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { mode: 'orbit', icon: <Globe2 size={12} />, label: 'Orbit' },
    { mode: 'first-person', icon: <User size={12} />, label: 'Walk' },
    { mode: 'free', icon: <Move3D size={12} />, label: 'Free' },
  ];

  return (
    <div className="absolute inset-x-0 top-0 z-50 pointer-events-none font-sans">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 pointer-events-auto">
        {/* Left: Back + Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={leaveRepository}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
          >
            <Home size={14} />
            <span>Universe</span>
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 px-3 py-2 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10">
            <button
              onClick={() => navigateTo('')}
              className="text-xs text-white/60 hover:text-white transition-colors"
            >
              {activeRepository.name}
            </button>
            {currentPath.segments.map((segment, idx) => (
              <span
                key={`${segment}-${idx}`}
                className="flex items-center gap-1"
              >
                <ChevronRight size={10} className="text-white/30" />
                <button
                  onClick={() =>
                    navigateTo(currentPath.segments.slice(0, idx + 1).join('/'))
                  }
                  className="text-xs text-white/60 hover:text-white transition-colors"
                >
                  {segment}
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Right: Camera modes */}
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10">
          <Camera size={12} className="text-white/40 mr-1" />
          {cameraModes.map((cm) => (
            <button
              key={cm.mode}
              onClick={() => setCameraMode(cm.mode)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                cameraMode === cm.mode
                  ? 'bg-white/15 text-white'
                  : 'text-white/50 hover:text-white/80 hover:bg-white/5'
              }`}
            >
              {cm.icon}
              <span>{cm.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Building Detail */}
      {selectedBuilding && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-6 py-4 min-w-[280px] shadow-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <FolderOpen size={14} className="text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-medium text-white/90">
                  {selectedBuilding.fileName}
                </div>
                <div className="text-[10px] text-white/40 font-mono">
                  {selectedBuilding.filePath}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-white/50">
              <span className="flex items-center gap-1">
                <Eye size={10} />
                {(selectedBuilding.sizeBytes / 1024).toFixed(1)} KB
              </span>
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-white/60 font-mono text-[10px]">
                .{selectedBuilding.extension}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigate Up */}
      {currentPath.segments.length > 0 && (
        <div className="absolute bottom-6 left-6 pointer-events-auto">
          <button
            onClick={navigateUp}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-black/50 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
          >
            ← Back to{' '}
            {currentPath.segments.length > 1
              ? currentPath.segments[currentPath.segments.length - 2]
              : activeRepository.name}
          </button>
        </div>
      )}
    </div>
  );
}
