import React, { useMemo } from 'react';
import { PredictionReport as IPredictionReport } from '@/simulation/types';
import { RecoveryEngine } from '@/simulation/core/RecoveryEngine';
import { Circle } from 'lucide-react';

interface Props {
  report: IPredictionReport;
}

export function RecoveryTimeline({ report }: Props) {
  const steps = useMemo(() => {
    const engine = new RecoveryEngine();
    return engine.generateRecoveryPlan(report);
  }, [report]);

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4">
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">
        Automated Recovery Runbook
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10">
        {steps.map((step, i) => (
          <div key={i} className="relative group">
            <div className="absolute -left-[30px] top-1 bg-black p-1">
              <Circle className="w-3 h-3 text-purple-500" />
            </div>
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 group-hover:border-purple-500/30 transition-colors">
              <span className="text-gray-300 text-sm font-sans">{step}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
