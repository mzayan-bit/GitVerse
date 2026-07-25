import { useState } from 'react';
import {
  Plus,
  Pin,
  CheckCircle2,
  Circle,
  Clock,
  Clipboard,
} from 'lucide-react';
import { InvestigationManager } from '@/collaboration/investigations/InvestigationManager';
import { Investigation } from '@/collaboration/investigations/types';

export function InvestigationBoard() {
  const [investigations, setInvestigations] = useState<Investigation[]>(() =>
    InvestigationManager.getInstance().list()
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = selectedId
    ? InvestigationManager.getInstance().get(selectedId)
    : null;

  const handleCreate = () => {
    const inv = InvestigationManager.getInstance().create(
      'New Investigation',
      'Describe the incident or area of investigation.',
      'local-user'
    );
    setInvestigations(InvestigationManager.getInstance().list());
    setSelectedId(inv.id);
  };

  const statusColor: Record<string, string> = {
    open: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    in_progress: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
    resolved: 'text-green-400 bg-green-500/10 border-green-500/20',
    archived: 'text-gray-400 bg-gray-500/10 border-gray-500/20',
  };

  if (selected) {
    return (
      <div className="p-4 space-y-4 animate-in fade-in slide-in-from-right-4">
        <button
          onClick={() => setSelectedId(null)}
          className="text-xs text-gray-500 hover:text-white transition-colors"
        >
          ← Back to list
        </button>

        <div className="space-y-3">
          <h3 className="text-white font-bold text-sm">{selected.title}</h3>
          <span
            className={`inline-block px-2 py-0.5 rounded-full border text-[10px] uppercase font-bold ${statusColor[selected.status]}`}
          >
            {selected.status.replace('_', ' ')}
          </span>
          <p className="text-gray-400 text-xs">{selected.description}</p>
        </div>

        {/* Pinned Entities */}
        <div className="space-y-2">
          <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider flex items-center gap-1.5">
            <Pin className="w-3 h-3" /> Pinned Entities (
            {selected.pinnedEntityIds.length})
          </h4>
          {selected.pinnedEntityIds.map((id) => (
            <div
              key={id}
              className="px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-xs text-gray-300"
            >
              {id}
            </div>
          ))}
        </div>

        {/* Evidence */}
        <div className="space-y-2">
          <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider flex items-center gap-1.5">
            <Clipboard className="w-3 h-3" /> Evidence (
            {selected.evidence.length})
          </h4>
          {selected.evidence.map((e) => (
            <div
              key={e.id}
              className="px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-xs text-gray-300 flex items-center gap-2"
            >
              <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-[9px] uppercase">
                {e.type}
              </span>
              {e.label}
            </div>
          ))}
        </div>

        {/* Action Items */}
        <div className="space-y-2">
          <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
            Action Items ({selected.actionItems.length})
          </h4>
          {selected.actionItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-2 px-3 py-2 bg-white/5 border border-white/5 rounded-lg text-xs"
            >
              {item.status === 'done' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-green-400 flex-shrink-0" />
              ) : (
                <Circle className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
              )}
              <span
                className={`${item.status === 'done' ? 'text-gray-500 line-through' : 'text-gray-300'}`}
              >
                {item.title}
              </span>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-2">
          <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider flex items-center gap-1.5">
            <Clock className="w-3 h-3" /> Timeline
          </h4>
          {selected.timeline.map((entry) => (
            <div key={entry.id} className="flex items-start gap-2 text-xs">
              <div className="w-1 h-1 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
              <div>
                <span className="text-white font-semibold">
                  {entry.authorName}
                </span>{' '}
                <span className="text-gray-400">{entry.action}</span>{' '}
                <span className="text-indigo-400">{entry.details}</span>
                <div className="text-[10px] text-gray-600">
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
          Investigations
        </h4>
        <button
          onClick={handleCreate}
          className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20"
        >
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      {investigations.map((inv) => (
        <button
          key={inv.id}
          onClick={() => setSelectedId(inv.id)}
          className="w-full text-left p-3 bg-white/5 border border-white/5 rounded-xl hover:border-white/15 transition-colors space-y-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-white text-xs font-semibold truncate">
              {inv.title}
            </span>
            <span
              className={`px-1.5 py-0.5 rounded-full border text-[9px] uppercase font-bold ${statusColor[inv.status]}`}
            >
              {inv.status.replace('_', ' ')}
            </span>
          </div>
          <div className="text-[10px] text-gray-600">
            {inv.evidence.length} evidence · {inv.actionItems.length} action
            items
          </div>
        </button>
      ))}

      {investigations.length === 0 && (
        <div className="text-center py-8 text-gray-600 text-xs">
          No investigations yet. Start one to collaborate on an incident.
        </div>
      )}
    </div>
  );
}
