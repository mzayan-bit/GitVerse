import { useState, useEffect } from 'react';
import {
  X,
  Globe,
  Sparkles,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { ContextManager } from '@/ai/ContextManager';
import { RepositoryReasoner } from '@/ai/RepositoryReasoner';

export function RightContextPanel() {
  const contextMgr = ContextManager.getInstance();
  const [selectedEntity, setSelectedEntity] = useState(
    contextMgr.getContext().selectedEntityId
  );
  const [selectedEntityName, setSelectedEntityName] = useState(
    contextMgr.getContext().selectedEntityName
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const c = contextMgr.getContext();
      setSelectedEntity(c.selectedEntityId);
      setSelectedEntityName(c.selectedEntityName);
    }, 400);
    return () => clearInterval(interval);
  }, [contextMgr]);

  if (!selectedEntity) return null;

  const entityName = selectedEntityName || 'Selected Microservice';
  const analysis = RepositoryReasoner.analyzeRepository({
    id: selectedEntity,
    name: entityName,
    healthScore: 0.94,
    complexityScore: 5,
    language: 'TypeScript',
  });

  const handleClose = () => {
    contextMgr.updateContext({
      selectedEntityId: undefined,
      selectedEntityName: undefined,
    });
  };

  return (
    <aside className="absolute top-12 bottom-6 right-0 w-88 z-40 bg-[#0B0F17]/95 backdrop-blur-2xl border-l border-white/10 p-4 font-sans text-white text-xs select-none shadow-2xl animate-in slide-in-from-right-6 duration-200 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block">
                {entityName}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                Contextual Entity Panel
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Health Score & Language */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block mb-0.5">
              Health Rating
            </span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {Math.round(analysis.healthScore * 100)}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block mb-0.5">
              Stack Language
            </span>
            <span className="text-xl font-black font-mono text-cyan-300">
              {analysis.primaryLanguage}
            </span>
          </div>
        </div>

        {/* AI Insight Summary */}
        <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Architecture Insight</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* System Recommendations */}
        <div className="space-y-2">
          <span className="text-[10px] text-gray-400 font-medium block">
            Recommended Actions:
          </span>
          {analysis.recommendedActions.map((rec: string, i: number) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-200 flex items-center justify-between"
            >
              <span>{rec}</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Audit Trigger */}
      <div className="pt-3 border-t border-white/10">
        <button className="w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)]">
          <ShieldCheck className="w-4 h-4" />
          <span>Run Security Audit</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
