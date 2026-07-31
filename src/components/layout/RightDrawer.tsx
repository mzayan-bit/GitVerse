import { useEffect, useState } from 'react';
import { X, Sparkles, ShieldCheck, ExternalLink, Globe } from 'lucide-react';
import { ContextManager } from '@/ai/ContextManager';
import { RepositoryReasoner } from '@/ai/RepositoryReasoner';
import { useEntityManager } from '@/entities/EntityManager';
import { useGraphManager } from '@/intelligence/KnowledgeGraph/GraphManager';

export function RightDrawer() {
  const contextMgr = ContextManager.getInstance();
  const { entities, focusedEntityId, setFocusedEntity } = useEntityManager();
  const { graph } = useGraphManager();

  const [contextState, setContextState] = useState(contextMgr.getContext());

  useEffect(() => {
    const interval = setInterval(() => {
      setContextState(contextMgr.getContext());
    }, 300);
    return () => clearInterval(interval);
  }, [contextMgr]);

  const selectedEntityId = focusedEntityId || contextState.selectedEntityId;
  if (!selectedEntityId) return null;

  const entity = entities[selectedEntityId];
  const entityName =
    contextState.selectedEntityName || entity?.name || 'Selected Component';

  const handleClose = () => {
    setFocusedEntity(null);
    contextMgr.updateContext({
      selectedEntityId: undefined,
      selectedEntityName: undefined,
    });
  };

  const analysis = RepositoryReasoner.analyzeRepository({
    id: selectedEntityId,
    name: entityName,
    healthScore: 0.94,
    complexityScore: 5,
    language: 'TypeScript',
  });

  const connectedEdges = graph?.getConnectedEdges(selectedEntityId) || [];

  return (
    <aside
      aria-label="Context Inspector Drawer"
      className="fixed top-12 bottom-0 right-0 w-96 z-40 bg-[#0B0F17]/95 backdrop-blur-2xl border-l border-white/10 p-5 font-sans text-white text-xs select-none shadow-2xl animate-in slide-in-from-right-6 duration-200 flex flex-col justify-between overflow-y-auto custom-scrollbar"
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block truncate max-w-[210px]">
                {entityName}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {entity?.type
                  ? `${entity.type.toUpperCase()} INSPECTOR`
                  : 'CONTEXTUAL INSPECTOR'}
              </span>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close Inspector Drawer"
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Health & Tech Metrics Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block mb-0.5 font-medium">
              Health Rating
            </span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {Math.round(analysis.healthScore * 100)}%
            </span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-gray-400 block mb-0.5 font-medium">
              Primary Language
            </span>
            <span className="text-xl font-black font-mono text-cyan-300">
              {analysis.primaryLanguage}
            </span>
          </div>
        </div>

        {/* AI Insight Summary */}
        <div className="p-3.5 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1.5">
          <div className="flex items-center gap-1.5 text-purple-300 font-semibold text-[11px]">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Spatial AI Architecture Insight</span>
          </div>
          <p className="text-[11px] text-gray-300 leading-relaxed">
            {analysis.summary}
          </p>
        </div>

        {/* Graph Dependencies if present */}
        {connectedEdges.length > 0 && (
          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <span className="text-[10px] text-gray-400 font-medium block">
              Knowledge Graph Connections ({connectedEdges.length})
            </span>
            <div className="space-y-1">
              {connectedEdges.slice(0, 3).map((edge, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-black/40 p-2 rounded-lg text-[10px]"
                >
                  <span className="truncate max-w-[180px] text-gray-300">
                    {edge.targetId === selectedEntityId
                      ? edge.sourceId
                      : edge.targetId}
                  </span>
                  <span className="text-purple-300 font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
                    {edge.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="space-y-2">
          <span className="text-[10px] text-gray-400 font-medium block">
            Recommended Actions:
          </span>
          {analysis.recommendedActions.map((rec: string, i: number) => (
            <div
              key={i}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-200 flex items-center justify-between transition-colors cursor-pointer"
            >
              <span>{rec}</span>
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer Security Action */}
      <div className="pt-4 border-t border-white/10 mt-4">
        <button className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.4)]">
          <ShieldCheck className="w-4 h-4" />
          <span>Run Deep Security Audit</span>
        </button>
      </div>
    </aside>
  );
}
