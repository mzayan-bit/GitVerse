import { useState, useEffect } from 'react';
import {
  X,
  Globe,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Code2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { ContextManager, SpatialAIContext } from '@/ai/ContextManager';
import { RepositoryReasoner } from '@/ai/RepositoryReasoner';

export function ContextualInspectorDrawer() {
  const contextMgr = ContextManager.getInstance();
  const [ctx, setCtx] = useState<SpatialAIContext>(contextMgr.getContext());

  useEffect(() => {
    const interval = setInterval(() => {
      setCtx({ ...contextMgr.getContext() });
    }, 400);
    return () => clearInterval(interval);
  }, [contextMgr]);

  if (!ctx.selectedEntityId && !ctx.hoveredEntityId) return null;

  const entityName = ctx.selectedEntityName || 'Selected Repository';
  const analysis = RepositoryReasoner.analyzeRepository({
    id: ctx.selectedEntityId || 'repo-1',
    name: entityName,
    healthScore: 0.92,
    complexityScore: 4,
    language: 'TypeScript',
  });

  const handleClose = () => {
    contextMgr.updateContext({
      selectedEntityId: undefined,
      selectedEntityName: undefined,
    });
  };

  return (
    <div className="fixed top-12 right-4 z-40 w-80 p-4 rounded-2xl bg-black/85 backdrop-blur-2xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] text-white text-xs font-sans select-none animate-in slide-in-from-right-6 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-sm text-white block">
              {entityName}
            </span>
            <span className="text-[10px] text-gray-400 font-mono">
              3D Entity Inspector
            </span>
          </div>
        </div>
        <button
          onClick={handleClose}
          className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Health & Metrics Cards */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-gray-400 block">Health Score</span>
          <span className="text-base font-bold font-mono text-emerald-400">
            {Math.round(analysis.healthScore * 100)}%
          </span>
        </div>

        <div className="p-2 rounded-xl bg-white/5 border border-white/10">
          <span className="text-[10px] text-gray-400 block">Language</span>
          <span className="text-base font-bold font-mono text-cyan-300">
            {analysis.primaryLanguage}
          </span>
        </div>
      </div>

      {/* AI Summary */}
      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-indigo-300 font-semibold text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Spatial AI Summary</span>
        </div>
        <p className="text-[11px] text-gray-300 leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* Quick Action Badges */}
      <div className="space-y-1.5 border-t border-white/10 pt-2.5">
        <span className="text-[10px] text-gray-400 font-medium block">
          Quick Actions:
        </span>
        <button className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[11px] text-gray-200 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Open Code Editor</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
        </button>

        <button className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[11px] text-gray-200 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <GitBranch className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Active Branches</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
        </button>

        <button className="w-full p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-left text-[11px] text-gray-200 flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security & Risk Audit</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
