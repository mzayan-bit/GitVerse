import React from 'react';
import { PredictionReport as IPredictionReport } from '@/simulation/types';
import {
  AlertOctagon,
  TrendingDown,
  Clock,
  ShieldAlert,
  Cpu,
} from 'lucide-react';

interface Props {
  report: IPredictionReport;
}

export function PredictionReport({ report }: Props) {
  const isCritical = report.criticalPathImpacted;

  return (
    <div className="max-w-5xl space-y-8 animate-in fade-in slide-in-from-bottom-4">
      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-2">
            <AlertOctagon className="w-4 h-4 text-purple-400" /> Affected Nodes
          </div>
          <div className="text-3xl font-bold text-white">
            {report.affectedNodes.length}
          </div>
        </div>

        <div
          className={`border p-4 rounded-xl ${isCritical ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10'}`}
        >
          <div
            className={`flex items-center gap-2 text-xs uppercase mb-2 ${isCritical ? 'text-red-400' : 'text-gray-400'}`}
          >
            <ShieldAlert className="w-4 h-4" /> Critical Path
          </div>
          <div
            className={`text-xl font-bold ${isCritical ? 'text-red-400' : 'text-white'}`}
          >
            {isCritical ? 'IMPACTED' : 'SAFE'}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-2">
            <Clock className="w-4 h-4 text-blue-400" /> Expected Downtime
          </div>
          <div className="text-2xl font-bold text-white">
            {(report.expectedDowntimeMs / 60000).toFixed(1)}{' '}
            <span className="text-sm text-gray-500 font-normal">mins</span>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-900/40 to-black border border-purple-500/30 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-gray-400 text-xs uppercase mb-2">
            <TrendingDown className="w-4 h-4 text-green-400" /> AI Confidence
          </div>
          <div className="text-3xl font-bold text-purple-300">
            {(report.confidenceScore * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" /> Blast Radius Analysis
          </h3>
          <div className="p-4 bg-black/40 border border-white/5 rounded-xl font-sans text-gray-300 leading-relaxed text-sm">
            {report.reasoning}
          </div>

          <div className="mt-4">
            <h4 className="text-xs uppercase text-gray-500 mb-2">
              Direct Casualties
            </h4>
            <div className="flex flex-wrap gap-2">
              {report.blastRadius.direct.map((node) => (
                <span
                  key={node}
                  className="px-2 py-1 bg-red-500/20 text-red-300 border border-red-500/30 rounded text-xs"
                >
                  {node}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-widest border-b border-white/10 pb-2">
            Predicted Cascading Failures
          </h3>
          {report.blastRadius.indirect.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {report.blastRadius.indirect.map((node) => (
                <span
                  key={node}
                  className="px-2 py-1 bg-orange-500/20 text-orange-300 border border-orange-500/30 rounded text-xs"
                >
                  {node}
                </span>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 text-xs p-4 border border-dashed border-white/10 rounded-xl text-center">
              No cascading failures detected outside direct blast radius.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
