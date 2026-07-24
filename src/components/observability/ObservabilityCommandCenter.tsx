import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  Play,
  Pause,
  FastForward,
  Filter,
  Search,
  Terminal,
  Zap,
  ShieldAlert,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useLiveState } from '@/universe/Live/LiveStateStore';
import { EventStore } from '@/observability/core/EventStore';
import { ReplayEngine } from '@/observability/core/ReplayEngine';
import { LiveEvent } from '@/observability/types';

export function ObservabilityCommandCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'metrics' | 'logs' | 'traces' | 'incidents'
  >('metrics');
  const [events, setEvents] = useState<LiveEvent[]>([]);
  const [isReplaying, setIsReplaying] = useState(false);
  const replayEngine = new ReplayEngine();

  // Poll event store for recent events just for UI feed
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setEvents(EventStore.getInstance().getRecent(50).reverse());
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleReplay = async () => {
    if (isReplaying) {
      replayEngine.stopReplay();
      setIsReplaying(false);
    } else {
      setIsReplaying(true);
      await replayEngine.replayRecent(100, 2.0); // 2x speed replay
      setIsReplaying(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-black/60 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 shadow-[0_0_30px_rgba(0,100,255,0.2)] transition-all group"
      >
        <Activity className="w-6 h-6 text-blue-400 group-hover:text-blue-300" />
      </button>
    );
  }

  return (
    <div className="fixed inset-6 z-50 flex flex-col bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-gradient-to-r from-blue-900/20 to-transparent">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-blue-400" />
          <h2 className="text-lg font-bold text-white tracking-widest uppercase">
            Live Observability
          </h2>
          <div className="flex items-center gap-2 ml-6 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">System Healthy</span>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 bg-black/40">
        <div className="flex gap-2">
          {(['metrics', 'logs', 'traces', 'incidents'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter events..."
              className="pl-9 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500/50"
            />
          </div>

          <div className="h-6 w-px bg-white/10" />

          <div className="flex gap-2">
            <button
              onClick={handleReplay}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                isReplaying
                  ? 'bg-orange-500/20 border-orange-500/50 text-orange-400'
                  : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
              }`}
            >
              {isReplaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isReplaying ? 'Stop Replay' : 'Time Travel'}
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden flex">
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            {events
              .filter((e) =>
                activeTab === 'metrics' ? true : e.type === activeTab
              )
              .map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            {events.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-4 mt-20">
                <Activity className="w-12 h-12 opacity-20" />
                <p>Waiting for live events...</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Analytics */}
        <div className="w-80 border-l border-white/10 bg-black/20 p-6 space-y-6">
          <div className="space-y-2">
            <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider mb-4">
              Event Throughput
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl text-white font-bold">
                {events.length}
              </span>
              <span className="text-gray-500">events/sec</span>
            </div>
            <div className="h-16 w-full bg-gradient-to-t from-blue-500/20 to-transparent mt-4 border-b border-blue-500/50" />
          </div>

          <div className="space-y-4">
            <h3 className="text-gray-400 text-xs uppercase font-bold tracking-wider">
              Active Providers
            </h3>
            {['OpenTelemetry', 'Prometheus', 'Grafana'].map((p) => (
              <div
                key={p}
                className="flex items-center justify-between bg-white/5 p-3 rounded-lg border border-white/5"
              >
                <span className="text-gray-300">{p}</span>
                <span className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function EventRow({ event }: { event: LiveEvent }) {
  const time = new Date(event.timestamp).toLocaleTimeString();

  const getIcon = () => {
    switch (event.type) {
      case 'incident':
        return <ShieldAlert className="w-4 h-4 text-red-400" />;
      case 'trace':
        return <Zap className="w-4 h-4 text-purple-400" />;
      case 'metric':
        return <Activity className="w-4 h-4 text-blue-400" />;
      case 'deployment':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'log':
        return <Terminal className="w-4 h-4 text-gray-400" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getDetails = () => {
    switch (event.type) {
      case 'metric':
        return `${event.metricName}: ${event.value.toFixed(2)}${event.unit}`;
      case 'incident':
        return event.title;
      case 'trace':
        return `${event.serviceName} - ${event.operationName} (${event.durationMs.toFixed(0)}ms)`;
      case 'deployment':
        return `Deployed ${event.serviceName} v${event.version}`;
      case 'log':
        return event.message;
      default:
        return '...';
    }
  };

  return (
    <div className="flex items-center gap-4 py-3 px-4 hover:bg-white/5 rounded-lg border border-transparent hover:border-white/10 transition-colors group">
      <div className="w-20 text-gray-500 text-xs">{time}</div>
      <div className="p-2 bg-white/5 rounded-md group-hover:bg-white/10">
        {getIcon()}
      </div>
      <div className="w-32 flex flex-col">
        <span className="text-gray-300 uppercase text-xs font-bold">
          {event.type}
        </span>
        <span className="text-gray-500 text-xs">{event.provider}</span>
      </div>
      <div className="flex-1 text-gray-300">{getDetails()}</div>
      <div className="text-xs text-gray-500 font-mono bg-black/40 px-2 py-1 rounded border border-white/5">
        {event.sourceId}
      </div>
    </div>
  );
}
