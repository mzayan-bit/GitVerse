import { useState } from 'react';
import {
  useMotionConfig,
  MotionQualityPreset,
} from '@/engine/motion/MotionConfig';
import { Activity, Gauge, Sliders, EyeOff, X, Check } from 'lucide-react';

interface MotionPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MotionPanel({ isOpen, onClose }: MotionPanelProps) {
  const {
    qualityPreset,
    reducedMotion,
    globalSpeed,
    setQualityPreset,
    setReducedMotion,
    setGlobalSpeed,
  } = useMotionConfig();

  const [activePreset, setActivePreset] = useState('snappy');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-xl bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-indigo-400" />
            <h2 className="text-base font-semibold text-white tracking-wide">
              Motion Engine & Micro-Interactions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Spring Physics Preset */}
          <section className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              <span>Spring Physics Profile</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
              {['gentle', 'snappy', 'elastic', 'smooth', 'bounce'].map(
                (preset) => (
                  <button
                    key={preset}
                    onClick={() => setActivePreset(preset)}
                    className={`px-4 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-between ${
                      activePreset === preset
                        ? 'bg-indigo-600/90 border-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>{preset}</span>
                    {activePreset === preset && (
                      <Check className="w-3.5 h-3.5 text-white" />
                    )}
                  </button>
                )
              )}
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Animation Quality Preset */}
          <section className="space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-sky-400" />
              <span>Motion Quality Profile</span>
            </h3>
            <div className="flex gap-3">
              {(['low', 'balanced', 'ultra'] as MotionQualityPreset[]).map(
                (q) => (
                  <button
                    key={q}
                    onClick={() => setQualityPreset(q)}
                    className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold uppercase tracking-wider transition-all ${
                      qualityPreset === q
                        ? 'bg-sky-600/90 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.5)]'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                )
              )}
            </div>
          </section>

          <hr className="border-white/10" />

          {/* Global Speed Slider */}
          <section className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-gray-300">
                Global Animation Speed
              </span>
              <span className="font-mono text-indigo-400">
                {globalSpeed.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="2.0"
              step="0.1"
              value={globalSpeed}
              onChange={(e) => setGlobalSpeed(parseFloat(e.target.value))}
              className="w-full accent-indigo-500 bg-white/10 rounded-lg cursor-pointer"
            />
          </section>

          <hr className="border-white/10" />

          {/* Reduced Motion Toggle */}
          <section className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5">
            <div className="flex items-center gap-3">
              <EyeOff className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-xs font-semibold text-white">
                  Reduced Motion Mode
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">
                  Disables rapid spatial camera pan & spring oscillations
                </p>
              </div>
            </div>
            <button
              onClick={() => setReducedMotion(!reducedMotion)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                reducedMotion ? 'bg-amber-500' : 'bg-gray-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  reducedMotion ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
