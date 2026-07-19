'use client';

import {
  Database,
  FileText,
  LayoutGrid,
  Zap,
  Server,
  AlertCircle,
  Clock,
  HardDrive,
} from 'lucide-react';

export function IndexingDashboard() {
  return (
    <div className="h-full w-full overflow-y-auto p-6 font-sans text-white bg-[#0B0E14]">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white/90">
          Indexing Status
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Retrieval-Augmented Generation (RAG) Pipeline
        </p>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Database size={18} className="text-blue-400" />}
          label="Repositories Indexed"
          value="1"
          subtext="Active in vector storage"
        />
        <StatCard
          icon={<FileText size={18} className="text-emerald-400" />}
          label="Files Indexed"
          value="1,204"
          subtext="Successfully parsed"
        />
        <StatCard
          icon={<LayoutGrid size={18} className="text-purple-400" />}
          label="Chunks Created"
          value="4,892"
          subtext="Avg. 380 tokens/chunk"
        />
        <StatCard
          icon={<HardDrive size={18} className="text-amber-400" />}
          label="Index Size"
          value="24.8 MB"
          subtext="Vector embeddings + metadata"
        />
      </div>

      {/* System Status & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="col-span-1 lg:col-span-2 glass-panel rounded-xl p-6 bg-white/[0.02] border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2 mb-6">
            <Zap size={16} className="text-white/60" />
            <h2 className="text-sm font-semibold tracking-widest text-white/80 uppercase">
              Embedding Progress
            </h2>
          </div>

          <div className="mb-2 flex justify-between text-xs">
            <span className="text-white/60">
              Processing: src/intelligence/rag/builder/DocumentBuilder.ts
            </span>
            <span className="text-blue-400">92%</span>
          </div>
          <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden mb-6">
            <div
              className="h-full bg-blue-500 rounded-full"
              style={{ width: '92%' }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-black/20 border border-white/5">
              <div className="text-xs text-white/40 mb-1">
                Embedding Provider
              </div>
              <div className="text-sm text-white/80 flex items-center gap-2">
                <Server size={14} className="text-blue-400" /> OpenAI
                (text-embedding-3-small)
              </div>
            </div>
            <div className="p-4 rounded-lg bg-black/20 border border-white/5">
              <div className="text-xs text-white/40 mb-1">Vector Storage</div>
              <div className="text-sm text-white/80 flex items-center gap-2">
                <Database size={14} className="text-emerald-400" />{' '}
                MemoryStorage (Dev)
              </div>
            </div>
          </div>
        </div>

        {/* Health & Latency */}
        <div className="col-span-1 glass-panel rounded-xl p-6 bg-white/[0.02] border border-white/10 backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <AlertCircle size={16} className="text-white/60" />
              <h2 className="text-sm font-semibold tracking-widest text-white/80 uppercase">
                System Health
              </h2>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-white/60">Search Latency</span>
              <span className="text-sm text-emerald-400 flex items-center gap-1">
                <Clock size={14} /> 42ms
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-white/60">Indexing Failures</span>
              <span className="text-sm text-white/80">0</span>
            </div>
          </div>

          <div className="mt-8 p-3 rounded-lg bg-emerald-900/10 border border-emerald-500/20 text-center">
            <span className="text-xs text-emerald-400/90 font-medium">
              Pipeline Operational
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
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
