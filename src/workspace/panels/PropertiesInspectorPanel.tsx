import { Sliders } from 'lucide-react';
import { useInteractionStore } from '@/navigation/interaction/InteractionStore';

export function PropertiesInspectorPanel() {
  const hoveredTarget = useInteractionStore((s) => s.hoveredTarget);
  const selectedTargets = useInteractionStore((s) => s.selectedTargets);

  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-indigo-400">
        <Sliders className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Entity Properties
        </span>
      </div>

      <div className="space-y-2 font-mono text-[11px]">
        <div className="p-2 rounded bg-white/5 border border-white/5 flex justify-between">
          <span className="text-gray-500">Selected Count</span>
          <span className="text-white font-bold">{selectedTargets.length}</span>
        </div>
        <div className="p-2 rounded bg-white/5 border border-white/5 flex justify-between">
          <span className="text-gray-500">Hover Target</span>
          <span className="text-indigo-300 font-bold truncate max-w-[140px]">
            {hoveredTarget ? hoveredTarget.entityId : 'None'}
          </span>
        </div>
      </div>
    </div>
  );
}
