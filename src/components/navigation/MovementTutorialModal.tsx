import { X, Gamepad2, MousePointer, Compass, Shield } from 'lucide-react';

interface MovementTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MovementTutorialModal({
  isOpen,
  onClose,
}: MovementTutorialModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-2xl bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <Gamepad2 className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white tracking-wide">
              Universe Controls & Navigation Guide
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Keybindings */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-300">
              <Compass className="w-4 h-4" />
              <span>Keyboard Flying (WASD / QE)</span>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between items-center">
                <span>Move Forward / Backward</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                  W / S
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Strafe Left / Right</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                  A / D
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Climb Up / Descend Down</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                  E / Q
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Speed Turbo Boost</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                  Shift
                </span>
              </div>
            </div>
          </div>

          {/* Mouse & Trackpad */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-300">
              <MousePointer className="w-4 h-4" />
              <span>Mouse & Trackpad Gestures</span>
            </div>
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex justify-between items-center">
                <span>Rotate Orbit / Look Around</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                  Left Drag
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Zoom In / Out</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                  Scroll Wheel
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Context Menu</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                  Right Click
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Quick Framed Fly-To</span>
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-white">
                  Click & Hold
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/5 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Inertia & Collision Prevention Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
