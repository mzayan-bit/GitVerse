import { FileText } from 'lucide-react';

export function InvestigationsPanel() {
  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-sky-400">
        <FileText className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Recent Investigations
        </span>
      </div>
      <p className="text-gray-500 text-[11px]">
        No active collaborative investigation notes open.
      </p>
    </div>
  );
}
