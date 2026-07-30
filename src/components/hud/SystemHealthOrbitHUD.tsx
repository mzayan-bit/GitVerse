import { useState } from 'react';
import {
  ShieldCheck,
  Cpu,
  CheckCircle,
  Code2,
  AlertTriangle,
} from 'lucide-react';

interface SystemHealthOrbitHUDProps {
  entityName?: string;
  healthScore?: number;
  codeQuality?: number;
  securityScore?: number;
  performanceScore?: number;
  testCoverage?: number;
  techDebtScore?: number;
}

export function SystemHealthOrbitHUD({
  entityName = 'Netflix Zuul Gateway',
  healthScore = 92,
  codeQuality = 95,
  securityScore = 98,
  performanceScore = 91,
  testCoverage = 88,
  techDebtScore = 12,
}: SystemHealthOrbitHUDProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-40 select-none font-sans animate-in fade-in zoom-in-95 duration-300">
      {/* Central Circular HUD Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer Orbiting Animated Ring */}
        <div className="absolute w-56 h-56 rounded-full border border-indigo-500/30 border-t-indigo-400 border-r-cyan-400 animate-spin-slow pointer-events-none" />
        <div className="absolute w-48 h-48 rounded-full border border-purple-500/20 border-b-purple-400 animate-reverse-spin pointer-events-none" />

        {/* Central Core Score Sphere */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-36 h-36 rounded-full bg-black/85 backdrop-blur-2xl border-2 border-emerald-500/50 shadow-[0_0_40px_rgba(16,185,129,0.3)] flex flex-col items-center justify-center text-center p-2 hover:scale-105 transition-all cursor-pointer group"
        >
          <span className="text-[10px] text-gray-400 uppercase tracking-widest font-mono line-clamp-1 max-w-[100px]">
            {entityName}
          </span>
          <span className="text-3xl font-black font-mono text-emerald-400 group-hover:text-emerald-300">
            {healthScore}
          </span>
          <span className="text-[9px] text-emerald-300/80 font-semibold tracking-wider uppercase">
            HEALTH SCORE
          </span>
        </button>

        {/* Orbit Satellite Metric Pills */}
        <div className="absolute -top-4 -left-12 p-2 rounded-xl bg-black/90 backdrop-blur-xl border border-indigo-500/40 shadow-lg flex items-center gap-1.5 text-xs text-white">
          <Code2 className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-[10px] text-gray-300">Quality:</span>
          <span className="font-mono font-bold text-indigo-400">
            {codeQuality}%
          </span>
        </div>

        <div className="absolute -top-4 -right-12 p-2 rounded-xl bg-black/90 backdrop-blur-xl border border-emerald-500/40 shadow-lg flex items-center gap-1.5 text-xs text-white">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-[10px] text-gray-300">Security:</span>
          <span className="font-mono font-bold text-emerald-400">
            {securityScore}%
          </span>
        </div>

        <div className="absolute -bottom-4 -left-12 p-2 rounded-xl bg-black/90 backdrop-blur-xl border border-cyan-500/40 shadow-lg flex items-center gap-1.5 text-xs text-white">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] text-gray-300">Perf:</span>
          <span className="font-mono font-bold text-cyan-400">
            {performanceScore}%
          </span>
        </div>

        <div className="absolute -bottom-4 -right-12 p-2 rounded-xl bg-black/90 backdrop-blur-xl border border-purple-500/40 shadow-lg flex items-center gap-1.5 text-xs text-white">
          <CheckCircle className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[10px] text-gray-300">Coverage:</span>
          <span className="font-mono font-bold text-purple-400">
            {testCoverage}%
          </span>
        </div>
      </div>

      {/* Detailed Expanded Drawer */}
      {isExpanded && (
        <div className="mt-4 p-3 rounded-2xl bg-black/90 backdrop-blur-2xl border border-white/10 shadow-2xl max-w-xs mx-auto text-xs text-gray-300 space-y-2 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between text-[11px] font-semibold text-white">
            <span>System Telemetry Breakdowns</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="flex items-center justify-between p-1.5 rounded bg-white/5 text-[10px]">
            <span className="text-gray-400">Technical Debt Ratio</span>
            <span className="font-mono text-amber-400 font-bold">
              {techDebtScore}% Low Risk
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
