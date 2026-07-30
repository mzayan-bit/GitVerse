import { useState } from 'react';
import {
  Globe,
  Star,
  GitPullRequest,
  AlertCircle,
  GitBranch,
  ShieldCheck,
  Code2,
  ExternalLink,
  Activity,
} from 'lucide-react';
import { DemoManager } from '@/demo/DemoManager';

export function UniverseInspectorPanel() {
  const demoMgr = DemoManager.getInstance();
  const activeOrg = demoMgr.getActiveOrg();
  const repos = demoMgr.getActiveOrgRepos();
  const [selectedRepo] = useState(
    repos[0] || {
      id: 'zuul-gateway',
      name: 'zuul-gateway',
      language: 'Java',
      healthScore: 0.94,
      complexityIndex: 6,
      openIssues: 12,
      stars: 14200,
      team: 'Edge Gateway',
      description:
        'API Gateway service providing dynamic routing & security filtering.',
    }
  );

  return (
    <div className="space-y-3.5 text-xs text-gray-200 font-sans select-none">
      {/* Repo Title & Org Header */}
      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-white block">
              {selectedRepo.name}
            </span>
            <span className="text-[10px] text-purple-300 font-mono">
              {activeOrg.name} Organization
            </span>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
          HEALTH: {Math.round(selectedRepo.healthScore * 100)}%
        </span>
      </div>

      {/* Description */}
      <p className="text-[11px] text-gray-300 leading-relaxed px-1">
        {selectedRepo.description}
      </p>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-4 gap-2 font-mono text-[11px]">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <Star className="w-3.5 h-3.5 text-amber-400 mx-auto mb-1" />
          <span className="text-white font-bold block">
            {selectedRepo.stars.toLocaleString()}
          </span>
          <span className="text-gray-400 text-[9px]">STARS</span>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <AlertCircle className="w-3.5 h-3.5 text-red-400 mx-auto mb-1" />
          <span className="text-white font-bold block">
            {selectedRepo.openIssues}
          </span>
          <span className="text-gray-400 text-[9px]">ISSUES</span>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <GitPullRequest className="w-3.5 h-3.5 text-purple-400 mx-auto mb-1" />
          <span className="text-white font-bold block">8</span>
          <span className="text-gray-400 text-[9px]">OPEN PRs</span>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center">
          <GitBranch className="w-3.5 h-3.5 text-cyan-400 mx-auto mb-1" />
          <span className="text-white font-bold block">14</span>
          <span className="text-gray-400 text-[9px]">BRANCHES</span>
        </div>
      </div>

      {/* Language Breakdown */}
      <div className="space-y-1.5 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold">
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Languages & Composition</span>
          </div>
          <span className="font-mono text-gray-400 text-[10px]">
            {selectedRepo.language}
          </span>
        </div>

        {/* Stacked Progress Bar */}
        <div className="w-full h-2.5 rounded-full bg-white/10 overflow-hidden flex">
          <div
            className="h-full bg-purple-500 w-[65%]"
            title="TypeScript 65%"
          />
          <div className="h-full bg-cyan-400 w-[20%]" title="Go 20%" />
          <div className="h-full bg-emerald-400 w-[15%]" title="Python 15%" />
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" />
            <span>{selectedRepo.language} (65%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            <span>Go (20%)</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Python (15%)</span>
          </div>
        </div>
      </div>

      {/* Activity Timeline Sparkline */}
      <div className="space-y-1.5 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-cyan-300 font-semibold">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Commit Velocity & Sparkline</span>
          </div>
          <span className="font-mono text-emerald-400 text-[10px]">
            +24% this month
          </span>
        </div>

        {/* Sparkline Bars */}
        <div className="h-10 rounded-xl bg-white/5 border border-white/10 p-2 flex items-end justify-between gap-1">
          {[40, 65, 30, 85, 90, 45, 100, 70, 60, 95, 80, 100].map((val, i) => (
            <div
              key={i}
              className="flex-1 bg-gradient-to-t from-purple-600 to-cyan-400 rounded-t transition-all hover:brightness-125"
              style={{ height: `${val}%` }}
              title={`Day ${i + 1}: ${val} commits`}
            />
          ))}
        </div>
      </div>

      {/* Security Audit Badge */}
      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-emerald-300 text-[11px]">
            Security Audit: Passed (0 Vulns)
          </span>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-emerald-400 cursor-pointer" />
      </div>
    </div>
  );
}
