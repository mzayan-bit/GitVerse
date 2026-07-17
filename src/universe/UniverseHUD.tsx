'use client';

import { useMemo } from 'react';
import { useUniverseManager } from './UniverseManager';
import { useEntityManager } from '@/entities/EntityManager';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import {
  Building2,
  Database,
  Star,
  GitFork,
  Code2,
  Navigation,
  Globe2,
} from 'lucide-react';

export function UniverseHUD() {
  const { isBuilt, hierarchy, cameraState } = useUniverseManager();
  const { entities } = useEntityManager();

  const stats = useMemo(() => {
    if (!isBuilt) return null;

    let totalStars = 0;
    let totalForks = 0;
    const languages = new Set<string>();

    for (const planet of hierarchy.planets) {
      const entity = entities[planet.id];
      if (!entity || !entity.metadata?.repository) continue;

      const repo = entity.metadata.repository as RepositoryDomainModel;
      totalStars += repo.stars;
      totalForks += repo.forks;
      languages.add(repo.primaryLanguage);
    }

    return {
      organizations: hierarchy.galaxies.length,
      repositories: hierarchy.planets.length,
      languages: languages.size,
      totalStars,
      totalForks,
    };
  }, [isBuilt, hierarchy, entities]);

  if (!isBuilt || !stats) return null;

  return (
    <div className="absolute bottom-6 left-6 z-40 font-sans pointer-events-none">
      <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl w-64 pointer-events-auto">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <Globe2 size={16} className="text-white/60" />
          <h2 className="text-xs font-semibold tracking-widest text-white/80 uppercase">
            Universe State
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatBox
            icon={<Building2 size={14} />}
            label="Galaxies"
            value={stats.organizations}
            color="text-blue-400"
          />
          <StatBox
            icon={<Database size={14} />}
            label="Planets"
            value={stats.repositories}
            color="text-emerald-400"
          />
          <StatBox
            icon={<Star size={14} />}
            label="Total Mass"
            value={stats.totalStars.toLocaleString()}
            color="text-amber-400"
          />
          <StatBox
            icon={<GitFork size={14} />}
            label="Total Moons"
            value={stats.totalForks.toLocaleString()}
            color="text-purple-400"
          />
        </div>

        {/* Bottom Row */}
        <div className="space-y-3 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white/50">
              <Code2 size={12} />
              <span>Biomes</span>
            </div>
            <span className="text-white/90 font-medium">
              {stats.languages} Unique
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-white/50">
              <Navigation size={12} />
              <span>Camera</span>
            </div>
            <span className="text-white/90 font-medium capitalize">
              {cameraState.mode}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className={`flex items-center gap-1.5 ${color} opacity-80`}>
        {icon}
        <span className="text-[10px] uppercase tracking-wider font-semibold">
          {label}
        </span>
      </div>
      <div className="text-lg font-light text-white/90">{value}</div>
    </div>
  );
}
