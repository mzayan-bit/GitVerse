'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, Server, Database, Sparkles } from 'lucide-react';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';

interface ImportLoadingProps {
  repositories: RepositoryDomainModel[];
  onComplete: () => void;
}

export function ImportLoading({
  repositories,
  onComplete,
}: ImportLoadingProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('Initializing connection...');

  useEffect(() => {
    if (repositories.length === 0) return;

    let current = 0;
    const total = repositories.length;

    const interval = setInterval(() => {
      current += Math.max(1, Math.floor(total / 20)); // progress in chunks

      if (current >= total) {
        current = total;
        setProgress(100);
        setStatus('Universe generated successfully.');
        clearInterval(interval);

        setTimeout(() => {
          onComplete();
        }, 1500); // Wait a bit to show 100%
      } else {
        setProgress((current / total) * 100);

        if (current < total * 0.3) {
          setStatus('Scanning repository metadata...');
        } else if (current < total * 0.6) {
          setStatus('Mapping domain entities...');
        } else if (current < total * 0.9) {
          setStatus('Generating orbital parameters...');
        } else {
          setStatus('Finalizing gravitational physics...');
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [repositories, onComplete]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-700">
      <div className="w-[450px] overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-2xl p-8">
        <div className="flex justify-center mb-8">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10">
            {progress === 100 ? (
              <CheckCircle2
                size={40}
                className="text-emerald-400 animate-in zoom-in duration-500"
              />
            ) : (
              <Sparkles size={40} className="text-white animate-pulse" />
            )}

            {/* Rotating rings */}
            <div
              className={`absolute inset-0 rounded-full border border-t-white/40 border-r-transparent border-b-transparent border-l-transparent transition-all duration-1000 ${progress < 100 ? 'animate-spin' : 'opacity-0'}`}
            />
            <div
              className={`absolute -inset-2 rounded-full border border-b-white/20 border-r-transparent border-t-transparent border-l-transparent transition-all duration-1000 ${progress < 100 ? 'animate-[spin_3s_linear_reverse_infinite]' : 'opacity-0'}`}
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-medium tracking-tight text-white mb-2">
            Importing Git Data
          </h2>
          <p className="text-sm text-white/50 h-5 font-mono">{status}</p>
        </div>

        {/* Progress Bar */}
        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5 flex flex-col items-center justify-center text-center">
            <Server size={18} className="text-white/40 mb-2" />
            <div className="text-xl font-medium text-white">
              {Math.floor((progress / 100) * repositories.length)}
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Repositories
            </div>
          </div>
          <div className="rounded-2xl bg-white/5 p-4 border border-white/5 flex flex-col items-center justify-center text-center">
            <Database size={18} className="text-white/40 mb-2" />
            <div className="text-xl font-medium text-white">
              {Math.floor(
                (progress / 100) *
                  repositories.reduce((acc, r) => acc + r.stars, 0)
              ).toLocaleString()}
            </div>
            <div className="text-xs text-white/40 uppercase tracking-wider mt-1">
              Stars Mapped
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
