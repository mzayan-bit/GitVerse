'use client';

import { useMemo } from 'react';
import {
  Activity,
  Code2,
  Box,
  Cpu,
  FileText,
  Network,
  FolderTree,
} from 'lucide-react';
import { CodeMetrics } from '@/intelligence/analysis/metrics/CodeMetricsEngine';

interface AnalyticsDashboardProps {
  metrics: CodeMetrics | null;
}

export function AnalyticsDashboard({ metrics }: AnalyticsDashboardProps) {
  const topLanguages = useMemo(() => {
    if (!metrics) return [];
    return Object.entries(metrics.languageDistribution)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [metrics]);

  if (!metrics) {
    return (
      <div className="flex h-full items-center justify-center text-white/50">
        <p>Run analysis to view metrics</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-y-auto p-6 font-sans text-white bg-[#0B0E14]">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white/90">
          Repository Analytics
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Code Intelligence Engine Overview
        </p>
      </header>

      {/* High-level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          icon={<Cpu size={18} className="text-blue-400" />}
          label="Cyclomatic Complexity"
          value={metrics.cyclomaticComplexityEstimate.toLocaleString()}
          subtext="Estimated total branches"
        />
        <KpiCard
          icon={<FolderTree size={18} className="text-emerald-400" />}
          label="Max Directory Depth"
          value={metrics.maxDirectoryDepth}
          subtext="Levels deep"
        />
        <KpiCard
          icon={<Network size={18} className="text-purple-400" />}
          label="Max Dependency Depth"
          value={metrics.maxDependencyDepth}
          subtext="Longest import chain"
        />
        <KpiCard
          icon={<FileText size={18} className="text-amber-400" />}
          label="Code Density"
          value={`${(metrics.codeDensity * 100).toFixed(1)}%`}
          subtext="LOC vs Whitespace/Comments"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Language Breakdown */}
        <div className="col-span-1 glass-panel rounded-xl p-6 bg-white/[0.02] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Code2 size={16} className="text-white/60" />
            <h2 className="text-sm font-semibold tracking-widest text-white/80 uppercase">
              Language Breakdown
            </h2>
          </div>
          <div className="space-y-4">
            {topLanguages.map(([lang, lines]) => (
              <div key={lang}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/80">{lang}</span>
                  <span className="text-white/50">
                    {lines.toLocaleString()} LOC
                  </span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min(100, (lines / (topLanguages[0]?.[1] || 1)) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Largest Modules */}
        <div className="col-span-1 glass-panel rounded-xl p-6 bg-white/[0.02] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Box size={16} className="text-white/60" />
            <h2 className="text-sm font-semibold tracking-widest text-white/80 uppercase">
              Largest Modules
            </h2>
          </div>
          <div className="space-y-3">
            {metrics.largestModules.map((mod, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5"
              >
                <span className="text-xs font-mono text-white/70 truncate mr-4">
                  {mod.path}
                </span>
                <span className="text-xs text-amber-400/90 whitespace-nowrap">
                  {mod.size.toLocaleString()} LOC
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Hotspots */}
        <div className="col-span-1 glass-panel rounded-xl p-6 bg-white/[0.02] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Activity size={16} className="text-white/60" />
            <h2 className="text-sm font-semibold tracking-widest text-white/80 uppercase">
              Hotspot Candidates
            </h2>
          </div>
          <div className="space-y-3">
            {metrics.hotspotCandidates.length > 0 ? (
              metrics.hotspotCandidates.map((path, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-900/10 border border-red-500/20"
                >
                  <span className="text-xs font-mono text-white/70 truncate">
                    {path}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-white/40">
                No critical hotspots detected.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
}) {
  return (
    <div className="glass-panel rounded-xl p-5 bg-white/[0.02] border border-white/10 backdrop-blur-md flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-xs font-semibold tracking-wider text-white/60 uppercase">
          {label}
        </span>
      </div>
      <div className="text-3xl font-light text-white/90 tracking-tight">
        {value}
      </div>
      <div className="text-xs text-white/40">{subtext}</div>
    </div>
  );
}
