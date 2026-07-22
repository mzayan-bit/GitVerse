import { useState } from 'react';
import {
  Activity,
  Server,
  Database,
  Cloud,
  AlertTriangle,
  Play,
  CheckCircle,
  XCircle,
  X,
  Settings2,
} from 'lucide-react';
import { useUniverseManager } from '@/universe/UniverseManager';

export interface CommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandCenter({ isOpen, onClose }: CommandCenterProps) {
  const [provider, setProvider] = useState<string>('All');
  const { hierarchy } = useUniverseManager();

  const numClusters = hierarchy?.clusters?.length || 0;
  const numServices = hierarchy?.services?.length || 0;
  const numDatabases = hierarchy?.databases?.length || 0;

  if (!isOpen) return null;

  return (
    <div className="absolute top-20 right-6 w-[360px] animate-in fade-in slide-in-from-right-8 font-sans z-50">
      <div className="rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Settings2 size={14} className="text-white/50" />
            <h2 className="text-xs font-semibold tracking-wider text-white/60 uppercase">
              Command Center
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/15"
          >
            <X size={12} className="text-white/50" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 overflow-y-auto text-sm text-white/90 custom-scrollbar">
          {/* Filters */}
          <div className="flex gap-2">
            {['All', 'AWS', 'GCP', 'Azure'].map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${provider === p ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' : 'bg-white/5 text-white/60 border border-white/5 hover:bg-white/10'}`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Overview Metrics */}
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                label: 'Clusters',
                value: numClusters,
                icon: <Server size={18} />,
                color: 'text-cyan-400',
              },
              {
                label: 'Services',
                value: numServices,
                icon: <Activity size={18} />,
                color: 'text-purple-400',
              },
              {
                label: 'Databases',
                value: numDatabases,
                icon: <Database size={18} />,
                color: 'text-pink-400',
              },
              {
                label: 'Resources',
                value: 154,
                icon: <Cloud size={18} />,
                color: 'text-blue-400',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex flex-col items-center text-center justify-center gap-1"
              >
                <div
                  className={`flex items-center gap-1.5 ${stat.color} mb-1 opacity-80`}
                >
                  {stat.icon}
                  <span className="text-[10px] font-semibold uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <span className="text-xl font-medium text-white truncate w-full">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          {/* Incident Center */}
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 shadow-2xl shadow-red-500/5">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <AlertTriangle size={14} />
              <h3 className="text-[10px] font-bold uppercase tracking-wider">
                Incident Center
              </h3>
            </div>
            <div className="bg-black/40 rounded-lg p-3 border border-red-500/20">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-medium text-red-200">
                  High Latency
                </span>
                <span className="text-[10px] text-red-400">Just now</span>
              </div>
              <p className="text-xs text-red-300/70 leading-relaxed">
                API Gateway is experiencing elevated response times (&gt;500ms)
                in us-east-1.
              </p>
            </div>
          </div>

          {/* Deployment Timeline */}
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-4">
            <h3 className="text-[10px] font-bold uppercase tracking-wider mb-4 text-white/50 flex items-center gap-2">
              <Activity size={14} /> Deployment Timeline
            </h3>
            <div className="flex flex-col gap-3">
              {[
                {
                  id: 'auth-service-v2',
                  status: 'running',
                  time: 'In Progress',
                },
                { id: 'payment-gateway', status: 'success', time: '2m ago' },
                { id: 'redis-cache-sync', status: 'failed', time: '15m ago' },
              ].map((dep, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 shrink-0">
                    {dep.status === 'running' && (
                      <Play
                        size={12}
                        className="text-cyan-400 animate-pulse fill-cyan-400"
                      />
                    )}
                    {dep.status === 'success' && (
                      <CheckCircle size={12} className="text-emerald-400" />
                    )}
                    {dep.status === 'failed' && (
                      <XCircle size={12} className="text-red-400" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-white truncate">
                      {dep.id}
                    </p>
                    <p className="text-[10px] text-white/40">{dep.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
