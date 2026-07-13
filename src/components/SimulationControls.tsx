'use client';

import { useState } from 'react';
import { useSolarSystemManager } from '@/systems/SolarSystem/SolarSystemManager';
import {
  Play,
  Pause,
  RotateCcw,
  Orbit,
  Crosshair,
  Eye,
  EyeOff,
  Settings2,
} from 'lucide-react';

export function SimulationControls() {
  const {
    simulationSpeed,
    setSimulationSpeed,
    showOrbits,
    setShowOrbits,
    cameraMode,
    setCameraMode,
    generateSystem,
    systemConfig,
  } = useSolarSystemManager();

  const [isOpen, setIsOpen] = useState(true);

  if (!systemConfig) return null;

  const currentPlanets = systemConfig.planets.length;

  return (
    <div className="absolute top-6 right-6 z-50 flex flex-col items-end gap-4 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white/70 backdrop-blur-md transition-all hover:bg-white/10 hover:text-white focus:outline-none"
      >
        <Settings2 size={20} />
      </button>

      {isOpen && (
        <div className="w-80 rounded-2xl border border-white/10 bg-black/40 p-5 text-white/90 shadow-2xl backdrop-blur-xl">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-sm font-semibold tracking-wider text-white">
              TELEMETRY
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setSimulationSpeed(simulationSpeed === 0 ? 1 : 0)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20"
                title={simulationSpeed === 0 ? 'Resume' : 'Pause'}
              >
                {simulationSpeed === 0 ? (
                  <Play size={14} />
                ) : (
                  <Pause size={14} />
                )}
              </button>
              <button
                onClick={() =>
                  generateSystem('gitverse-genesis-system', currentPlanets)
                }
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20"
                title="Reset System"
              >
                <RotateCcw size={14} />
              </button>
            </div>
          </div>

          {/* Speed Controls */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span className="uppercase tracking-widest">Time Dilation</span>
              <span>{simulationSpeed}x</span>
            </div>
            <div className="flex gap-2">
              {[0.5, 1, 2, 5].map((speed) => (
                <button
                  key={speed}
                  onClick={() => setSimulationSpeed(speed)}
                  className={`flex-1 rounded-md py-1.5 text-xs font-medium transition-colors ${
                    simulationSpeed === speed
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Camera Modes */}
          <div className="mb-6 space-y-3">
            <div className="text-xs uppercase tracking-widest text-white/50">
              Camera Mode
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCameraMode('free')}
                className={`flex flex-1 flex-col items-center gap-1 rounded-md py-2 transition-colors ${
                  cameraMode === 'free'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/15'
                }`}
              >
                <Crosshair size={16} />
                <span className="text-[10px] uppercase">Free</span>
              </button>
              <button
                onClick={() => setCameraMode('orbit')}
                className={`flex flex-1 flex-col items-center gap-1 rounded-md py-2 transition-colors ${
                  cameraMode === 'orbit'
                    ? 'bg-white/20 text-white'
                    : 'bg-white/5 text-white/50 hover:bg-white/15'
                }`}
              >
                <Orbit size={16} />
                <span className="text-[10px] uppercase">Orbit</span>
              </button>
            </div>
          </div>

          {/* Visibility Controls */}
          <div className="mb-6 space-y-3">
            <div className="text-xs uppercase tracking-widest text-white/50">
              Visuals
            </div>
            <button
              onClick={() => setShowOrbits(!showOrbits)}
              className="flex w-full items-center justify-between rounded-md bg-white/5 px-3 py-2 text-sm transition-colors hover:bg-white/10"
            >
              <span className="text-white/70">Orbit Trajectories</span>
              {showOrbits ? (
                <Eye size={16} />
              ) : (
                <EyeOff size={16} className="text-white/30" />
              )}
            </button>
          </div>

          {/* Planet Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span className="uppercase tracking-widest">Entities</span>
              <span>{currentPlanets}</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={currentPlanets}
              onChange={(e) =>
                generateSystem(
                  systemConfig.seed.value,
                  parseInt(e.target.value)
                )
              }
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
