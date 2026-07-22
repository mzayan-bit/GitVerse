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
} from 'lucide-react';
import { useUniverseManager } from '@/universe/UniverseManager';

export function CommandCenter() {
  const [provider, setProvider] = useState<string>('All');
  const { hierarchy } = useUniverseManager();

  const numClusters = hierarchy?.clusters?.length || 0;
  const numServices = hierarchy?.services?.length || 0;
  const numDatabases = hierarchy?.databases?.length || 0;

  return (
    <div className="absolute top-0 right-0 w-96 h-full p-6 font-sans text-white z-20 pointer-events-none">
      <div className="w-full h-full flex flex-col gap-6 pointer-events-auto overflow-y-auto overflow-x-hidden p-2 hide-scrollbar">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Command Center
          </h2>
          <p className="text-sm text-white/50">
            Live Infrastructure Digital Twin
          </p>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
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
        </div>

        {/* Overview Metrics */}
        <div className="grid grid-cols-2 gap-4">
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
              label: 'Cloud Resources',
              value: 154,
              icon: <Cloud size={18} />,
              color: 'text-blue-400',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col gap-2"
            >
              <div className={`flex items-center gap-2 ${stat.color}`}>
                {stat.icon}
                <span className="text-xs font-medium uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
              <span className="text-3xl font-light tracking-tighter">
                {stat.value}
              </span>
            </div>
          ))}
        </div>

        {/* Incident Center */}
        <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/30 rounded-2xl p-5 shadow-2xl shadow-red-500/5">
          <div className="flex items-center gap-2 text-red-400 mb-3">
            <AlertTriangle size={18} />
            <h3 className="text-sm font-bold uppercase tracking-wider">
              Incident Center
            </h3>
          </div>
          <div className="bg-black/40 rounded-lg p-3 border border-red-500/20">
            <div className="flex justify-between items-start mb-1">
              <span className="text-sm font-medium text-red-200">
                High Latency Detected
              </span>
              <span className="text-xs text-red-400">Just now</span>
            </div>
            <p className="text-xs text-red-300/70">
              API Gateway is experiencing elevated response times (&gt;500ms) in
              us-east-1.
            </p>
          </div>
        </div>

        {/* Deployment Timeline */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-white/80">
            Deployment Timeline
          </h3>
          <div className="flex flex-col gap-4">
            {[
              { id: 'auth-service-v2', status: 'running', time: 'In Progress' },
              { id: 'payment-gateway', status: 'success', time: '2m ago' },
              { id: 'redis-cache-sync', status: 'failed', time: '15m ago' },
            ].map((dep, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1">
                  {dep.status === 'running' && (
                    <Play size={16} className="text-cyan-400 animate-pulse" />
                  )}
                  {dep.status === 'success' && (
                    <CheckCircle size={16} className="text-green-400" />
                  )}
                  {dep.status === 'failed' && (
                    <XCircle size={16} className="text-red-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{dep.id}</p>
                  <p className="text-xs text-white/50">{dep.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
