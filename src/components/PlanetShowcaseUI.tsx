'use client';

import { useMemo } from 'react';
import { useSceneStore } from '@/store/scene-store';
import { PlanetFactory } from '@/planets/PlanetFactory';

const PLANET_SEEDS = [
  { name: 'Genesis', seed: 'gitverse-genesis' },
  { name: 'Proxima', seed: 'proxima-centauri' },
  { name: 'Arrakis', seed: 'dune-desert' },
  { name: 'Hoth', seed: 'ice-world' },
  { name: 'Mustafar', seed: 'lava-world' },
  { name: 'Endor', seed: 'forest-moon' },
];

export function PlanetShowcaseUI() {
  const currentPlanetSeed = useSceneStore((s) => s.currentPlanetSeed);
  const setPlanetSeed = useSceneStore((s) => s.setPlanetSeed);

  const planetConfig = useMemo(() => {
    return PlanetFactory.create(currentPlanetSeed);
  }, [currentPlanetSeed]);

  return (
    <>
      {/* Floating UI Overlay for Planet Selection */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
        <div className="flex gap-4 p-4 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {PLANET_SEEDS.map((p) => {
            const isActive = currentPlanetSeed === p.seed;
            return (
              <button
                key={p.seed}
                onClick={() => setPlanetSeed(p.seed)}
                className={`px-4 py-2 rounded-2xl text-xs uppercase tracking-widest font-mono transition-all duration-300 ${
                  isActive
                    ? 'bg-white/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                    : 'text-white/50 hover:text-white hover:bg-white/10'
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Planet Info Panel */}
      <div className="absolute top-32 left-10 z-50 pointer-events-auto">
        <div className="flex flex-col gap-2 p-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-light text-white tracking-wider capitalize">
            {planetConfig.type} World
          </h2>
          <div className="flex flex-col gap-2 text-[10px] text-white/50 uppercase tracking-widest mt-2 font-mono">
            <div className="flex justify-between w-40">
              <span>Radius</span>
              <span className="text-white/80">
                {planetConfig.terrain.baseRadius.toFixed(1)} Mm
              </span>
            </div>
            <div className="flex justify-between w-40">
              <span>Atmosphere</span>
              <span className="text-white/80">
                {planetConfig.atmosphere.enabled ? 'Present' : 'None'}
              </span>
            </div>
            <div className="flex justify-between w-40">
              <span>Seed Hash</span>
              <span className="text-white/80">
                {planetConfig.seed.value.substring(0, 8)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
