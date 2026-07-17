'use client';

import { useEntityManager } from '@/entities/EntityManager';
import { X, Code2, GitMerge, Star, Activity, GitFork } from 'lucide-react';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { MappedVisualProperties } from '@/mapping/MappingEngine';

export function EntityInspector() {
  const { entities, focusedEntityId, setFocusedEntity } = useEntityManager();

  if (!focusedEntityId) return null;

  const entity = entities[focusedEntityId];
  if (!entity) return null;

  const repoData = entity.metadata?.repository as
    RepositoryDomainModel | undefined;
  const visualProps = entity.metadata?.visuals as
    MappedVisualProperties | undefined;

  return (
    <div className="absolute right-6 top-24 z-50 flex w-96 flex-col gap-4 font-sans text-sm animate-in fade-in slide-in-from-right-8">
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-white/90 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase mb-1">
              {entity.type} Inspector
            </h2>
            <h3
              className="text-lg font-medium text-white truncate max-w-[240px]"
              title={entity.name}
            >
              {entity.name}
            </h3>
            <p className="text-xs text-white/40 mt-1 font-mono">
              ID: {entity.id}
            </p>
          </div>
          <button
            onClick={() => setFocusedEntity(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20"
          >
            <X size={14} />
          </button>
        </div>

        {/* Base Entity Properties */}
        <div className="mb-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-white/50">Seed</span>
            <span className="font-mono text-xs">{entity.seed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Hierarchy</span>
            <span className="text-xs text-emerald-400">
              Galaxy → {entity.type}
            </span>
          </div>
        </div>

        {/* GitHub Domain Model (Mocked) */}
        {repoData && (
          <div className="mb-4 rounded-xl bg-white/5 p-3">
            <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
              <Code2 size={12} /> GitHub Telemetry
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white/50">
                  <Star size={12} /> Stars
                </span>
                <span>{repoData.stars.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white/50">
                  <GitFork size={12} /> Forks
                </span>
                <span>{repoData.forks.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white/50">
                  <Activity size={12} /> Issues
                </span>
                <span>{repoData.issues.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-white/50">
                  <GitMerge size={12} /> Commits
                </span>
                <span>{repoData.commits.toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-white/50">Primary Language</span>
              <span className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: visualProps?.baseColor || '#fff' }}
                />
                {repoData.primaryLanguage}
              </span>
            </div>
          </div>
        )}

        {/* Mapped Visual Properties */}
        {visualProps && (
          <div className="rounded-xl bg-white/5 p-3">
            <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">
              Mapped Visual Values
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-white/50">Radius Scale (Stars)</span>
                <span>{visualProps.size.toFixed(2)}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Moons (Forks)</span>
                <span>{visualProps.moonCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Crater Density (Issues)</span>
                <span>{(visualProps.craterDensity * 100).toFixed(0)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Satellites (Contributors)</span>
                <span>{visualProps.satelliteCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Rotation Speed (Activity)</span>
                <span>{(visualProps.rotationSpeed * 100).toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/50">Biome Seed</span>
                <span className="font-mono text-[10px] truncate max-w-[120px]">
                  {visualProps.biomeSeed}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
