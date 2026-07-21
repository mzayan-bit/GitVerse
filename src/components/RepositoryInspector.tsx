'use client';

import { useEntityManager } from '@/entities/EntityManager';
import { useGraphManager } from '@/intelligence/KnowledgeGraph/GraphManager';
import {
  X,
  Code2,
  GitMerge,
  Star,
  Activity,
  GitFork,
  HeartPulse,
  Zap,
  ShieldAlert,
  Cpu,
} from 'lucide-react';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { RepositoryMetrics } from '@/intelligence/MetricsEngine';
import { EvolutionMode } from './evolution';
import { useState } from 'react';

export function RepositoryInspector() {
  const { entities, focusedEntityId, setFocusedEntity } = useEntityManager();
  const { graph } = useGraphManager();
  const [showEvolutionMode, setShowEvolutionMode] = useState(false);

  if (!focusedEntityId) return null;

  const entity = entities[focusedEntityId];
  if (!entity) return null;

  const repoData = entity.metadata?.repository as
    RepositoryDomainModel | undefined;

  if (!repoData) return null;

  // Since we added metrics to GraphNode, we can fetch it from the graph
  const node = graph?.nodes.get(repoData.id);
  const metrics = node?.metrics as unknown as RepositoryMetrics | undefined;
  const connectedEdges = graph?.getConnectedEdges(repoData.id) || [];

  return (
    <div className="absolute right-6 top-24 z-50 flex w-96 flex-col gap-4 font-sans text-sm animate-in fade-in slide-in-from-right-8">
      <div className="rounded-2xl border border-white/10 bg-black/40 p-5 text-white/90 shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xs font-semibold tracking-wider text-white/50 uppercase">
                Repository Inspector
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider ${repoData.visibility === 'private' ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}
              >
                {repoData.visibility === 'private' ? 'Private' : 'Public'}
              </span>
            </div>
            <h3
              className="text-lg font-medium text-white truncate max-w-[240px]"
              title={repoData.name}
            >
              {repoData.name}
            </h3>
            <p className="text-xs text-white/40 mt-1 line-clamp-2">
              {repoData.description || 'No description provided.'}
            </p>
          </div>
          <button
            onClick={() => setFocusedEntity(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/20"
          >
            <X size={14} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mb-4 flex flex-col gap-2">
          <button
            onClick={() => setShowEvolutionMode(true)}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white py-2.5 text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
          >
            <Activity size={16} />
            View Repository Evolution
          </button>

          <button
            onClick={() => {
              import('@/intelligence/impact/ImpactManager').then(
                ({ useImpactManager }) => {
                  useImpactManager.getState().openImpactMode();
                  setFocusedEntity(null); // Close inspector to focus on dashboard
                }
              );
            }}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/50 py-2.5 text-sm font-medium transition-colors"
          >
            <ShieldAlert size={16} />
            Simulate Impact
          </button>
        </div>

        {/* GitHub Telemetry Stats */}
        <div className="mb-4 rounded-xl bg-white/5 p-3">
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
        </div>

        {/* Intelligence Metrics */}
        {metrics && (
          <div className="mb-4 rounded-xl bg-white/5 p-3">
            <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
              <Cpu size={12} /> Health Indicators
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-white/70">
                    <HeartPulse size={12} /> Health Score
                  </span>
                  <span>{metrics.healthScore.toFixed(0)} / 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${metrics.healthScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-white/70">
                    <Zap size={12} /> Activity
                  </span>
                  <span>{metrics.activityScore.toFixed(0)} / 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400"
                    style={{ width: `${metrics.activityScore}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="flex items-center gap-1.5 text-white/70">
                    <ShieldAlert size={12} /> Risk Level
                  </span>
                  <span>{metrics.riskScore.toFixed(0)} / 100</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-400"
                    style={{ width: `${metrics.riskScore}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technology Breakdown */}
        <div className="mb-4 rounded-xl bg-white/5 p-3">
          <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3 flex items-center gap-2">
            <Code2 size={12} /> Tech Breakdown
          </h4>
          <div className="flex flex-wrap gap-2">
            {repoData.primaryLanguage &&
              repoData.primaryLanguage !== 'Unknown' && (
                <span className="px-2 py-1 rounded-md bg-white/10 text-xs text-white border border-white/5">
                  {repoData.primaryLanguage}
                </span>
              )}
            {repoData.topics.slice(0, 5).map((topic) => (
              <span
                key={topic}
                className="px-2 py-1 rounded-md bg-white/5 text-xs text-white/70 border border-white/5"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Graph Relationships */}
        <div className="rounded-xl bg-white/5 p-3">
          <h4 className="text-xs uppercase tracking-widest text-white/50 mb-3">
            Knowledge Graph Edges
          </h4>
          {connectedEdges.length > 0 ? (
            <div className="text-xs text-white/70">
              <p>
                Connected to <strong>{connectedEdges.length}</strong>{' '}
                repositories.
              </p>
              <ul className="mt-2 space-y-1">
                {connectedEdges.slice(0, 3).map((edge, i) => {
                  const isSource = edge.sourceId === repoData.id;
                  const otherNode = graph?.nodes.get(
                    isSource ? edge.targetId : edge.sourceId
                  );
                  return (
                    <li
                      key={i}
                      className="flex justify-between items-center bg-white/5 p-1.5 rounded"
                    >
                      <span className="truncate max-w-[150px]">
                        {otherNode?.repository.name}
                      </span>
                      <span className="text-[10px] text-white/40 uppercase bg-black/40 px-1.5 py-0.5 rounded">
                        {edge.type.replace('_', ' ')}
                      </span>
                    </li>
                  );
                })}
                {connectedEdges.length > 3 && (
                  <li className="text-center text-white/30 pt-1">
                    + {connectedEdges.length - 3} more
                  </li>
                )}
              </ul>
            </div>
          ) : (
            <div className="text-xs text-white/40 text-center py-2">
              No strong relationships discovered.
            </div>
          )}
        </div>
      </div>

      {showEvolutionMode && (
        <EvolutionMode
          repoFullName={repoData.fullName}
          onClose={() => setShowEvolutionMode(false)}
        />
      )}
    </div>
  );
}
