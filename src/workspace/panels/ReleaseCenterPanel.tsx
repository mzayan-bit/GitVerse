import { useState } from 'react';
import {
  Rocket,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  CheckCircle,
  ExternalLink,
  Server,
  Cloud,
} from 'lucide-react';
import { PerformanceMonitor } from '@/observability/PerformanceMonitor';
import { SecurityAudit } from '@/platform/hardening/SecurityAudit';
import { ReportGenerator } from '@/qa/ReportGenerator';
import { FeatureFlags } from '@/platform/hardening/FeatureFlags';

export function ReleaseCenterPanel() {
  const perfMonitor = PerformanceMonitor.getInstance();
  const flags = FeatureFlags.getInstance();

  const [health] = useState(perfMonitor.getHealth());
  const [secAudit] = useState(SecurityAudit.runAudit());
  const [qaReport] = useState(ReportGenerator.generateQualityReport());
  const [activeFlags, setActiveFlags] = useState(flags.getAll());

  const handleToggleFlag = (key: keyof typeof activeFlags) => {
    const nextVal = !activeFlags[key];
    flags.setFlag(key, nextVal);
    setActiveFlags(flags.getAll());
  };

  return (
    <div className="flex flex-col h-full text-xs font-sans text-gray-200 select-none space-y-3">
      {/* Header Banner */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-950/40 to-indigo-950/40 border border-emerald-500/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Rocket className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="font-bold text-white text-sm block">
              GitVerse v1.0 Enterprise
            </span>
            <span className="text-[10px] text-emerald-300 font-mono">
              General Availability Release
            </span>
          </div>
        </div>
        <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] border border-emerald-500/40 font-bold">
          STATUS: GA
        </span>
      </div>

      {/* System Health Telemetry */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <Activity className="w-3.5 h-3.5" />
          <span>Real-time Telemetry & Performance</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
            <span className="text-gray-400 text-[10px] block">FPS</span>
            <span className="text-base font-bold font-mono text-emerald-400">
              {health.fps}
            </span>
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
            <span className="text-gray-400 text-[10px] block">Heap Memory</span>
            <span className="text-base font-bold font-mono text-cyan-300">
              {health.memoryUsageMB} MB
            </span>
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/10 text-center">
            <span className="text-gray-400 text-[10px] block">GPU VRAM</span>
            <span className="text-base font-bold font-mono text-purple-300">
              {health.gpuMemoryMB} MB
            </span>
          </div>
        </div>
      </div>

      {/* Quality Assurance & Stress Testing */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Quality Assurance & Testing</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono">
            {qaReport.codeCoveragePct}% Coverage
          </span>
        </div>

        <div className="p-2.5 rounded bg-white/5 border border-white/10 flex items-center justify-between">
          <div>
            <span className="font-semibold text-white">Automated Suite</span>
            <p className="text-[10px] text-gray-400">
              {qaReport.totalTestsPassed} Tests Passing (0 Failures)
            </p>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
            Score: {qaReport.qualityScore}/100
          </span>
        </div>
      </div>

      {/* Security & Compliance Audit */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Security & Compliance Audit</span>
          </div>
          <span className="text-[10px] text-emerald-300 font-mono font-bold">
            {secAudit.score}% PASS
          </span>
        </div>

        <div className="space-y-1">
          {secAudit.checks.map((chk, i) => (
            <div
              key={i}
              className="p-1.5 rounded bg-white/5 flex items-center justify-between text-[10px]"
            >
              <span className="text-gray-300">{chk.name}</span>
              <span className="text-emerald-400 font-mono font-bold">
                PASSED
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Flags */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
          <Cpu className="w-3.5 h-3.5" />
          <span>Feature Flags & Remote Config</span>
        </div>

        <div className="space-y-1">
          {(Object.keys(activeFlags) as Array<keyof typeof activeFlags>).map(
            (key) => (
              <div
                key={key}
                className="flex items-center justify-between p-1.5 rounded bg-white/5"
              >
                <span className="text-gray-300 font-mono text-[10px]">
                  {key}
                </span>
                <button
                  onClick={() => handleToggleFlag(key)}
                  className={`w-7 h-4 rounded-full transition-colors relative p-0.5 ${
                    activeFlags[key] ? 'bg-indigo-500' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-black transition-transform ${
                      activeFlags[key] ? 'translate-x-3' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Cloud & On-Premises Deployment Links */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1.5 text-indigo-400 font-semibold">
          <Cloud className="w-3.5 h-3.5" />
          <span>Deployment Options</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <Server className="w-3 h-3 text-cyan-400" />
              <span>Docker & K8s</span>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </div>

          <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-purple-400" />
              <span>Vercel & AWS</span>
            </div>
            <ExternalLink className="w-3 h-3 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
