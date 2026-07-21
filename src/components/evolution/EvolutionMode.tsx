'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader2, X } from 'lucide-react';
import { useEvolutionManager } from '@/evolution/engine/EvolutionManager';
import { EvolutionVisualizer } from '@/evolution/visual';
import { TimelineWorkspace } from './TimelineWorkspace';
import { HistoryImporter } from '@/evolution/history/HistoryImporter';
import { useAuth } from '@/auth/hooks';
import { EvolutionEngine } from '@/evolution/engine/EvolutionEngine';

interface EvolutionModeProps {
  repoFullName: string;
  onClose: () => void;
}

export function EvolutionMode({ repoFullName, onClose }: EvolutionModeProps) {
  const { accessToken } = useAuth();
  const { error, setTimeline, setLoading, setError, reset } =
    useEvolutionManager();

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (!accessToken) return;

    let isMounted = true;
    const loadHistory = async () => {
      try {
        setInitialLoad(true);
        setLoading(true);
        setError(null);

        const importer = new HistoryImporter(accessToken);
        const [owner, repoName] = repoFullName.split('/');

        const history = await importer.importHistory(
          owner,
          repoName,
          'main', // Assuming 'main' as default for now
          (progress) => {
            console.log(
              Math.round((progress.loaded / Math.max(progress.total, 1)) * 100)
            );
          }
        );

        if (!isMounted) return;

        const timeline = EvolutionEngine.buildTimeline(history);
        setTimeline(timeline, history);
      } catch (err: unknown) {
        if (isMounted)
          setError(
            err instanceof Error ? err.message : 'Failed to load history'
          );
      } finally {
        if (isMounted) {
          setLoading(false);
          setInitialLoad(false);
        }
      }
    };

    loadHistory();

    return () => {
      isMounted = false;
      reset();
    };
  }, [repoFullName, accessToken, setTimeline, setLoading, setError, reset]);

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Top Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-6 pointer-events-none">
        <div className="flex flex-col gap-1 pointer-events-auto">
          <h1 className="text-2xl font-light text-white tracking-wide">
            Repository Evolution
          </h1>
          <h2 className="text-sm font-mono text-white/50">{repoFullName}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/20 transition-all pointer-events-auto backdrop-blur-md"
        >
          <X size={18} />
        </button>
      </div>

      {initialLoad ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
          <h3 className="text-lg font-light text-white">
            Time Machine Calibrating...
          </h3>
          <p className="text-sm text-white/50 mt-2">
            Fetching commit history and building snapshots
          </p>
        </div>
      ) : error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-20">
          <div className="text-red-400 mb-4 bg-red-400/10 p-4 rounded-xl">
            {error}
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      ) : (
        <>
          {/* 3D Visualizer */}
          <div className="absolute inset-0 z-0">
            <Canvas
              camera={{ position: [0, 60, 60], fov: 45 }}
              gl={{ antialias: true }}
            >
              <color attach="background" args={['#000000']} />
              <EvolutionVisualizer />
            </Canvas>
          </div>

          {/* Timeline Controls */}
          <TimelineWorkspace />
        </>
      )}
    </div>
  );
}
