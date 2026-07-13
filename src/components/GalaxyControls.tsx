'use client';

import { useState } from 'react';
import { useGalaxyManager } from '@/galaxy/GalaxyManager';
import { GalaxyShape } from '@/galaxy/GalaxyTypes';
import { Settings2, Shuffle, ArrowLeft } from 'lucide-react';

export function GalaxyControls() {
  const {
    galaxyConfig,
    generateGalaxy,
    cameraMode,
    setCameraMode,
    setFocusedSystemId,
  } = useGalaxyManager();

  const [isOpen, setIsOpen] = useState(true);

  if (!galaxyConfig) return null;

  const handleRandomizeSeed = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    generateGalaxy(randomSeed, galaxyConfig.systems.length, galaxyConfig.shape);
  };

  const handleShapeChange = (shape: GalaxyShape) => {
    generateGalaxy(galaxyConfig.seed.value, galaxyConfig.systems.length, shape);
  };

  const handleDensityChange = (count: number) => {
    generateGalaxy(galaxyConfig.seed.value, count, galaxyConfig.shape);
  };

  const isZoomedIn =
    cameraMode !== 'galaxy-free' && cameraMode !== 'galaxy-follow';

  return (
    <div className="absolute top-6 left-6 z-50 flex flex-col items-start gap-4 font-sans">
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
              GALAXY TELEMETRY
            </h2>
            <button
              onClick={handleRandomizeSeed}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20"
              title="Randomize Seed"
            >
              <Shuffle size={14} />
            </button>
          </div>

          {/* Navigation Return */}
          {isZoomedIn && (
            <div className="mb-6">
              <button
                onClick={() => {
                  setFocusedSystemId(null);
                  setCameraMode('galaxy-free');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-md bg-white/10 py-2 text-sm font-medium transition-colors hover:bg-white/20"
              >
                <ArrowLeft size={16} />
                Return to Galaxy View
              </button>
            </div>
          )}

          {/* Galaxy Shape */}
          <div className="mb-6 space-y-3">
            <div className="text-xs uppercase tracking-widest text-white/50">
              Morphology
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  'spiral',
                  'barred_spiral',
                  'elliptical',
                  'ring',
                  'irregular',
                  'dwarf',
                ] as GalaxyShape[]
              ).map((shape) => (
                <button
                  key={shape}
                  onClick={() => handleShapeChange(shape)}
                  className={`rounded-md py-1.5 text-xs font-medium transition-colors capitalize ${
                    galaxyConfig.shape === shape
                      ? 'bg-white text-black'
                      : 'bg-white/5 text-white/70 hover:bg-white/15'
                  }`}
                >
                  {shape.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* System Density */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span className="uppercase tracking-widest">System Density</span>
              <span>{galaxyConfig.systems.length}</span>
            </div>
            <input
              type="range"
              min="100"
              max="5000"
              step="100"
              value={galaxyConfig.systems.length}
              onChange={(e) => handleDensityChange(parseInt(e.target.value))}
              className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
}
