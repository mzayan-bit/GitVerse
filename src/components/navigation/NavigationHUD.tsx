import { useState } from 'react';
import {
  Bookmark,
  History,
  Settings2,
  Gamepad2,
  ChevronRight,
  RotateCcw,
  X,
} from 'lucide-react';
import { useCameraRig, CameraMode } from '@/navigation/camera/CameraRig';
import { useInteractionStore } from '@/navigation/interaction/InteractionStore';

const MODE_CONFIG: Record<
  CameraMode,
  { label: string; icon: string; description: string }
> = {
  orbit: { label: 'Orbit', icon: '🌍', description: 'Rotate around a point' },
  fly: { label: 'Fly', icon: '🚀', description: 'WASD + Q/E movement' },
  explore: { label: 'Explore', icon: '🧭', description: 'Free exploration' },
  focus: { label: 'Focus', icon: '🎯', description: 'Locked on target' },
  presentation: { label: 'Present', icon: '📺', description: 'Cinematic mode' },
  firstPerson: { label: 'FPS', icon: '👁', description: 'First person view' },
};

export function NavigationHUD() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const mode = useCameraRig((s) => s.mode);
  const bookmarks = useCameraRig((s) => s.bookmarks);
  const focusHistory = useCameraRig((s) => s.focusHistory);
  const isTransitioning = useCameraRig((s) => s.isTransitioning);
  const breadcrumbs = useInteractionStore((s) => s.breadcrumbs);

  const setMode = useCameraRig.getState().setMode;
  const addBookmark = useCameraRig.getState().addBookmark;
  const goToBookmark = useCameraRig.getState().goToBookmark;
  const removeBookmark = useCameraRig.getState().removeBookmark;
  const resetCamera = useCameraRig.getState().resetCamera;

  return (
    <>
      {/* ── Compass & Mode Indicator (Always Visible) ────────────── */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto">
        {/* Mini mode indicator */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-4 py-2.5 bg-black/70 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all group"
        >
          <span className="text-lg">{MODE_CONFIG[mode].icon}</span>
          <span className="text-xs text-white/70 font-mono uppercase tracking-widest group-hover:text-white/90">
            {MODE_CONFIG[mode].label}
          </span>
          {isTransitioning && (
            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          )}
          <ChevronRight
            className={`w-3 h-3 text-white/30 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          />
        </button>

        {/* ── Expanded Panel ──────────────────────────────────────── */}
        {isExpanded && (
          <div className="w-72 bg-black/85 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            {/* Mode Switcher */}
            <div className="p-4 border-b border-white/5">
              <h3 className="text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-3">
                Camera Mode
              </h3>
              <div className="grid grid-cols-3 gap-1.5">
                {(
                  Object.entries(MODE_CONFIG) as Array<
                    [CameraMode, (typeof MODE_CONFIG)[CameraMode]]
                  >
                ).map(([key, cfg]) => (
                  <button
                    key={key}
                    onClick={() => setMode(key)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl text-center transition-all ${
                      mode === key
                        ? 'bg-indigo-500/20 border border-indigo-500/30 text-white'
                        : 'hover:bg-white/5 text-gray-500 hover:text-gray-300 border border-transparent'
                    }`}
                  >
                    <span className="text-base">{cfg.icon}</span>
                    <span className="text-[9px] font-mono uppercase">
                      {cfg.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
              <button
                onClick={() => setShowBookmarks(!showBookmarks)}
                className={`p-2 rounded-lg transition-all ${showBookmarks ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <Bookmark className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-all ${showHistory ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <History className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg transition-all ${showSettings ? 'bg-indigo-500/20 text-indigo-300' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
              >
                <Settings2 className="w-4 h-4" />
              </button>
              <button
                onClick={resetCamera}
                className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                title="Reset camera"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Bookmarks Panel */}
            {showBookmarks && (
              <div className="p-4 border-b border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                    Bookmarks
                  </h4>
                  <button
                    onClick={() => addBookmark(`View ${bookmarks.length + 1}`)}
                    className="text-[10px] text-indigo-400 hover:text-indigo-300"
                  >
                    + Save
                  </button>
                </div>
                {bookmarks.map((bk) => (
                  <div
                    key={bk.id}
                    className="flex items-center justify-between py-1.5 group"
                  >
                    <button
                      onClick={() => goToBookmark(bk.id)}
                      className="text-xs text-gray-400 hover:text-white transition-colors truncate"
                    >
                      {bk.label}
                    </button>
                    <button
                      onClick={() => removeBookmark(bk.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                {bookmarks.length === 0 && (
                  <p className="text-[10px] text-gray-600">No bookmarks yet.</p>
                )}
              </div>
            )}

            {/* Focus History */}
            {showHistory && (
              <div className="p-4 border-b border-white/5 max-h-40 overflow-y-auto custom-scrollbar">
                <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2">
                  Focus History
                </h4>
                {focusHistory
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((entry, i) => (
                    <div
                      key={`${entry.entityId}-${i}`}
                      className="text-xs text-gray-500 py-1"
                    >
                      <span className="text-gray-400">{entry.entityId}</span>
                      <span className="text-gray-700 ml-2">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* Controls Help */}
            {(mode === 'fly' ||
              mode === 'explore' ||
              mode === 'firstPerson') && (
              <div className="p-4 space-y-1.5">
                <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-2 flex items-center gap-1.5">
                  <Gamepad2 className="w-3 h-3" /> Controls
                </h4>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <span className="text-gray-600">W/A/S/D</span>
                  <span className="text-gray-400">Move</span>
                  <span className="text-gray-600">Q / E</span>
                  <span className="text-gray-400">Up / Down</span>
                  <span className="text-gray-600">Shift</span>
                  <span className="text-gray-400">Speed boost</span>
                  <span className="text-gray-600">Space</span>
                  <span className="text-gray-400">Brake</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Breadcrumb Navigation ──────────────────────────────────── */}
      {breadcrumbs.length > 0 && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 px-4 py-2 bg-black/60 backdrop-blur-xl border border-white/10 rounded-full pointer-events-auto">
          {breadcrumbs.map((bc, i) => (
            <span key={bc.entityId} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3 text-gray-600" />}
              <button className="text-xs text-gray-400 hover:text-white transition-colors">
                {bc.label}
              </button>
            </span>
          ))}
        </div>
      )}
    </>
  );
}
