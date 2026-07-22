'use client';

import { useRef, useState } from 'react';
import {
  User,
  Building2,
  Database,
  Activity,
  HardDrive,
  Wifi,
  WifiOff,
  RefreshCw,
  Clock,
  BarChart3,
  X,
  Settings2,
} from 'lucide-react';
import { useAuth } from '@/auth/hooks';
import { repositoryCache, type CacheStatistics } from '@/github';
import type { ClientMetrics, GitHubRateLimit } from '@/github';

interface DeveloperDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  clientMetrics?: ClientMetrics;
  rateLimit?: GitHubRateLimit;
  importedRepoCount?: number;
  orgCount?: number;
}

export function DeveloperDashboard({
  isOpen,
  onClose,
  clientMetrics,
  rateLimit,
  importedRepoCount = 0,
  orgCount = 0,
}: DeveloperDashboardProps) {
  const { user, isAuthenticated } = useAuth();
  const [cacheStats, setCacheStats] = useState<CacheStatistics | null>(null);
  const statsLoadedRef = useRef<boolean | null>(null);

  if (statsLoadedRef.current == null) {
    statsLoadedRef.current = true;
    setCacheStats(repositoryCache.getStatistics());
  }

  if (!isOpen) return null;

  const refreshCacheStats = () => {
    setCacheStats(repositoryCache.getStatistics());
  };

  const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

  return (
    <div className="absolute left-6 top-20 z-50 w-[340px] animate-in fade-in slide-in-from-left-8 font-sans">
      <div className="rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Settings2 size={14} className="text-white/50" />
            <h2 className="text-xs font-semibold tracking-wider text-white/60 uppercase">
              Integration Dashboard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 transition-colors hover:bg-white/15"
          >
            <X size={12} className="text-white/50" />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4 overflow-y-auto text-sm text-white/90 custom-scrollbar">
          {/* User Info */}
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                {user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.image}
                    alt={user.name}
                    className="h-10 w-10 rounded-full"
                  />
                ) : (
                  <User size={18} className="text-white/50" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">
                  {user?.name || 'Not connected'}
                </div>
                <div className="text-xs text-white/40 truncate">
                  {user?.email || 'No email'}
                </div>
              </div>
              <div
                className={`h-2 w-2 rounded-full ${isAuthenticated ? 'bg-emerald-400' : 'bg-red-400'}`}
              />
            </div>
          </div>

          {/* Connection Health */}
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
              <Activity size={10} /> Connection Health
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-white/70">
                {isOnline ? (
                  <Wifi size={12} className="text-emerald-400" />
                ) : (
                  <WifiOff size={12} className="text-red-400" />
                )}
                {isOnline ? 'Online' : 'Offline'}
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <Clock size={10} className="shrink-0" />
                <span className="truncate">
                  {clientMetrics?.lastRequestAt
                    ? new Date(clientMetrics.lastRequestAt).toLocaleTimeString()
                    : 'No requests yet'}
                </span>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <Building2 size={14} className="mx-auto text-white/30 mb-1" />
              <div className="text-lg font-medium text-white">{orgCount}</div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">
                Orgs
              </div>
            </div>
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 text-center">
              <Database size={14} className="mx-auto text-white/30 mb-1" />
              <div className="text-lg font-medium text-white">
                {importedRepoCount}
              </div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider">
                Imported
              </div>
            </div>
          </div>

          {/* API Usage */}
          {clientMetrics && (
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2 flex items-center gap-1.5">
                <BarChart3 size={10} /> API Usage
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/50">Total Requests</span>
                  <span>{clientMetrics.totalRequests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Failed</span>
                  <span className="text-red-400">
                    {clientMetrics.failedRequests}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Rate Limit Hits</span>
                  <span className="text-amber-400">
                    {clientMetrics.rateLimitHits}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Rate Limit */}
          {rateLimit && (
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 mb-2">
                Rate Limit
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">
                    {rateLimit.remaining} / {rateLimit.limit} remaining
                  </span>
                  <span className="text-white/40">
                    Resets{' '}
                    {new Date(rateLimit.reset * 1000).toLocaleTimeString()}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 transition-all"
                    style={{
                      width: `${(rateLimit.remaining / rateLimit.limit) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Cache Stats */}
          <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10px] uppercase tracking-widest text-white/40 flex items-center gap-1.5">
                <HardDrive size={10} /> Cache
              </h3>
              <button
                onClick={refreshCacheStats}
                className="text-white/30 hover:text-white/70 transition-colors"
              >
                <RefreshCw size={10} />
              </button>
            </div>
            {cacheStats && (
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/50">Entries</span>
                  <span>{cacheStats.totalEntries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Cached Repos</span>
                  <span>{cacheStats.totalRepositories}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Memory Hits</span>
                  <span className="text-emerald-400">
                    {cacheStats.memoryHits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Persistent Hits</span>
                  <span className="text-blue-400">
                    {cacheStats.persistentHits}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Misses</span>
                  <span className="text-amber-400">{cacheStats.misses}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
