import { Search } from 'lucide-react';

export function SearchResultsPanel() {
  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-indigo-400">
        <Search className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Active Search Results
        </span>
      </div>
      <p className="text-gray-500 text-[11px]">
        Use ⌘K Universal Command Palette to execute global queries.
      </p>
    </div>
  );
}
