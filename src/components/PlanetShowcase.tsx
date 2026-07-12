'use client';

import React, { useMemo } from 'react';
import { useSceneStore } from '@/store/scene-store';
import { PlanetFactory } from '@/planets/PlanetFactory';
import { Planet } from '@/planets/Planet';

const PLANET_SEEDS = [
  { name: 'Genesis', seed: 'gitverse-genesis' },
  { name: 'Proxima', seed: 'proxima-centauri' },
  { name: 'Arrakis', seed: 'dune-desert' },
  { name: 'Hoth', seed: 'ice-world' },
  { name: 'Mustafar', seed: 'lava-world' },
  { name: 'Endor', seed: 'forest-moon' },
];

export function PlanetShowcase() {
  const currentPlanetSeed = useSceneStore((s) => s.currentPlanetSeed);
  const setPlanetSeed = useSceneStore((s) => s.setPlanetSeed);

  // Generate the planet config deterministically from the seed
  const planetConfig = useMemo(() => {
    return PlanetFactory.create(currentPlanetSeed);
  }, [currentPlanetSeed]);

  return (
    <>
      {/* 3D Planet Render */}
      <Planet config={planetConfig} position={[0, 0, -20]} />

      {/* Floating UI Overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div className="flex gap-4 p-4 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          {PLANET_SEEDS.map((p) => {
            const isActive = currentPlanetSeed === p.seed;
            return (
              <button
                key={p.seed}
                onClick={() => setPlanetSeed(p.seed)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
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

      {/* Planet Info */}
      <div className="absolute top-20 left-10 z-50">
        <div className="flex flex-col gap-2 p-6 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
          <h2 className="text-3xl font-light text-white tracking-wider capitalize">
            {planetConfig.type} Planet
          </h2>
          <div className="flex gap-4 text-xs text-white/50 uppercase tracking-widest mt-2">
            <span>Radius: {planetConfig.terrain.baseRadius.toFixed(1)}k</span>
            <span>Atmo: {planetConfig.atmosphere.enabled ? 'Yes' : 'No'}</span>
            <span>Seed: {planetConfig.seed.value.substring(0, 8)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
