'use client';

import {
  Activity,
  AlertTriangle,
  ShieldAlert,
  Cpu,
  Package,
  Play,
  Clock,
  CheckCircle2,
  ChevronRight,
  Database,
} from 'lucide-react';

export function CommandCenter() {
  return (
    <div className="h-full w-full bg-[#0B0E14] text-white p-6 overflow-y-auto font-sans relative">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white/90">
              Command Center
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Autonomous Engineering Intelligence
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg transition shadow-[0_0_15px_rgba(59,130,246,0.4)] text-sm font-medium">
              <Play size={16} /> Run Full Scan
            </button>
          </div>
        </header>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Active Agents"
            value="4"
            icon={<Cpu className="text-blue-400" size={18} />}
            trend="+2 since yesterday"
          />
          <MetricCard
            title="Completed Scans"
            value="1,284"
            icon={<CheckCircle2 className="text-emerald-400" size={18} />}
            trend="Last 7 days"
          />
          <MetricCard
            title="Critical Findings"
            value="3"
            icon={<AlertTriangle className="text-red-400" size={18} />}
            trend="-2 since last scan"
          />
          <MetricCard
            title="Queue Status"
            value="Empty"
            icon={<Database className="text-purple-400" size={18} />}
            trend="All tasks processed"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed: Findings & Recommendations */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Critical Findings List */}
            <div className="glass-panel p-6 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold flex items-center gap-2">
                  <ShieldAlert size={18} className="text-red-400" />
                  Critical Findings
                </h2>
                <button className="text-xs text-blue-400 hover:text-blue-300">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                <FindingItem
                  agent="Security Agent"
                  repo="mzayan-bit/GitVerse"
                  title="Hardcoded API Key in frontend/config.ts"
                  time="2m ago"
                />
                <FindingItem
                  agent="Architecture Agent"
                  repo="mzayan-bit/GitVerse"
                  title="Circular dependency between Scanner and Parser modules"
                  time="14m ago"
                />
                <FindingItem
                  agent="Dependency Agent"
                  repo="mzayan-bit/GitVerse"
                  title="Critical CVE-2023-456 in 'lodash' dependency"
                  time="1h ago"
                />
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="glass-panel p-6 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-6">
                <Activity size={18} className="text-blue-400" />
                Suggested Orchestrations
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-black/20 border border-white/5 rounded-xl hover:border-blue-500/30 transition cursor-pointer group">
                  <h3 className="text-sm font-medium text-white/90 mb-2">
                    Automated Security Patch
                  </h3>
                  <p className="text-xs text-white/50 mb-4">
                    Update &apos;lodash&apos; to v4.17.21 in package.json.
                  </p>
                  <button className="text-xs text-blue-400 flex items-center gap-1 group-hover:text-blue-300">
                    Execute <ChevronRight size={14} />
                  </button>
                </div>
                <div className="p-4 bg-black/20 border border-white/5 rounded-xl hover:border-emerald-500/30 transition cursor-pointer group">
                  <h3 className="text-sm font-medium text-white/90 mb-2">
                    Refactor Circular Dependency
                  </h3>
                  <p className="text-xs text-white/50 mb-4">
                    Extract shared types to a new Types.ts file to break the
                    cycle.
                  </p>
                  <button className="text-xs text-emerald-400 flex items-center gap-1 group-hover:text-emerald-300">
                    Review Plan <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Agent Health & History */}
          <div className="col-span-1 space-y-6">
            {/* Agent Fleet Status */}
            <div className="glass-panel p-6 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-6">
                <Package size={18} className="text-purple-400" />
                Agent Fleet
              </h2>
              <div className="space-y-4">
                <AgentStatus name="Security Agent" status="running" />
                <AgentStatus name="Architecture Agent" status="running" />
                <AgentStatus name="Dependency Agent" status="idle" />
                <AgentStatus name="Documentation Agent" status="idle" />
              </div>
            </div>

            {/* Execution History */}
            <div className="glass-panel p-6 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md">
              <h2 className="text-base font-semibold flex items-center gap-2 mb-6">
                <Clock size={18} className="text-white/60" />
                Recent Executions
              </h2>
              <div className="relative pl-4 space-y-6 border-l border-white/10 ml-2">
                <TimelineItem
                  title="Nightly Organization Scan"
                  time="Today, 3:00 AM"
                  status="success"
                />
                <TimelineItem
                  title="Repository Onboarding (GitVerse)"
                  time="Yesterday, 4:15 PM"
                  status="success"
                />
                <TimelineItem
                  title="Dependency Audit"
                  time="Yesterday, 12:00 PM"
                  status="failed"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) {
  return (
    <div className="p-5 bg-white/[0.02] border border-white/10 rounded-2xl backdrop-blur-md flex flex-col gap-2">
      <div className="flex items-center justify-between text-white/60">
        <span className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </span>
        {icon}
      </div>
      <div className="text-3xl font-light text-white/90">{value}</div>
      <div className="text-xs text-white/40">{trend}</div>
    </div>
  );
}

function FindingItem({
  agent,
  repo,
  title,
  time,
}: {
  agent: string;
  repo: string;
  title: string;
  time: string;
}) {
  return (
    <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-xl flex items-start gap-4 hover:bg-red-500/10 transition cursor-pointer">
      <div className="mt-1">
        <AlertTriangle size={16} className="text-red-400" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-white/90 font-medium mb-1">{title}</div>
        <div className="text-xs text-white/50 flex items-center gap-2">
          <span>{repo}</span>
          <span>•</span>
          <span className="text-red-400/80">{agent}</span>
        </div>
      </div>
      <div className="text-xs text-white/30">{time}</div>
    </div>
  );
}

function AgentStatus({
  name,
  status,
}: {
  name: string;
  status: 'running' | 'idle';
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-white/80">{name}</div>
      <div className="flex items-center gap-2">
        {status === 'running' && (
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        )}
        {status === 'idle' && (
          <span className="w-2 h-2 rounded-full bg-white/20" />
        )}
        <span className="text-xs text-white/40 capitalize">{status}</span>
      </div>
    </div>
  );
}

function TimelineItem({
  title,
  time,
  status,
}: {
  title: string;
  time: string;
  status: 'success' | 'failed';
}) {
  return (
    <div className="relative">
      <div
        className={`absolute -left-[21px] top-1.5 w-2 h-2 rounded-full ${status === 'success' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'}`}
      />
      <div className="text-sm text-white/80">{title}</div>
      <div className="text-xs text-white/40">{time}</div>
    </div>
  );
}
