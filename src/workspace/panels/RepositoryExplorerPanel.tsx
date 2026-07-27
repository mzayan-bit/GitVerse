import { FolderTree, GitBranch } from 'lucide-react';

export function RepositoryExplorerPanel() {
  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center justify-between font-mono text-[10px] text-gray-500 uppercase pb-2 border-b border-white/5">
        <span>Repositories (12 Active)</span>
        <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
      </div>

      <div className="space-y-1.5">
        {[
          'gitverse-core',
          'nebula-renderer',
          'knowledge-graph',
          'copilot-agent',
        ].map((repo) => (
          <div
            key={repo}
            className="p-2.5 rounded-lg border border-white/5 bg-white/5 hover:border-indigo-500/40 hover:bg-white/10 transition-all cursor-pointer flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-gray-200">{repo}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400">main</span>
          </div>
        ))}
      </div>
    </div>
  );
}
