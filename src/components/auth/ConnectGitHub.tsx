'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { GitBranch, Globe, Star, Loader2, AlertCircle } from 'lucide-react';

export function ConnectGitHub() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Initiates the OAuth flow
      await signIn('github', { callbackUrl: '/' });
    } catch {
      setError('Failed to connect to GitHub. Please try again.');
      setIsConnecting(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="w-[400px] overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-2xl backdrop-blur-2xl">
        {/* Header */}
        <div className="flex flex-col items-center justify-center px-8 pb-6 pt-10 text-center">
          <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <GitBranch size={32} className="text-white" />
          </div>
          <h2 className="mb-2 text-2xl font-medium tracking-tight text-white">
            Connect GitHub
          </h2>
          <p className="text-sm text-white/50">
            Authorize GitVerse to visualize your repositories as an interactive
            galaxy.
          </p>
        </div>

        {/* Benefits List */}
        <div className="space-y-4 px-8 py-6 bg-white/[0.02] border-y border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
              <Globe size={14} className="text-emerald-400" />
            </div>
            <span className="text-sm text-white/70">
              Explore your repositories as 3D planets
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
              <GitBranch size={14} className="text-blue-400" />
            </div>
            <span className="text-sm text-white/70">
              Visualize branches, commits, and activity
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5">
              <Star size={14} className="text-amber-400" />
            </div>
            <span className="text-sm text-white/70">
              Discover massive galaxies of open-source code
            </span>
          </div>
        </div>

        {/* Action Area */}
        <div className="px-8 py-6">
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-black transition-all hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConnecting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <GitBranch size={16} />
            )}
            {isConnecting ? 'Connecting...' : 'Continue with GitHub'}
          </button>

          {error && (
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-red-400">
              <AlertCircle size={12} />
              <span>{error}</span>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-white/30">
            We only request read-only access to your public repositories.
          </p>
        </div>
      </div>
    </div>
  );
}
