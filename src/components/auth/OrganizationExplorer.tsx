'use client';

import { useRef, useState } from 'react';
import {
  Building2,
  Search,
  Loader2,
  Globe,
  Lock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { GitHubOrganization } from '@/github';

interface OrganizationExplorerProps {
  accessToken: string;
  onSelectOrg: (orgLogin: string) => void;
  onSelectPersonal: () => void;
}

export function OrganizationExplorer({
  accessToken,
  onSelectOrg,
  onSelectPersonal,
}: OrganizationExplorerProps) {
  const [orgs, setOrgs] = useState<GitHubOrganization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const hasLoadedRef = useRef<boolean | null>(null);

  if (hasLoadedRef.current == null) {
    hasLoadedRef.current = true;
    // Fire off the async load — state updates happen in callbacks
    (async () => {
      try {
        const { ImportEngine } = await import('@/github');
        const engine = new ImportEngine(accessToken);
        const fetchedOrgs = await engine.fetchOrganizations();
        setOrgs(fetchedOrgs);
      } catch {
        setError('Failed to load organizations. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  }

  const retryLoad = () => {
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const { ImportEngine } = await import('@/github');
        const engine = new ImportEngine(accessToken);
        const fetchedOrgs = await engine.fetchOrganizations();
        setOrgs(fetchedOrgs);
      } catch {
        setError('Failed to load organizations. Please try again.');
      } finally {
        setLoading(false);
      }
    })();
  };

  const filtered = orgs.filter((org) =>
    org.login.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg animate-in fade-in duration-500">
      <div className="w-[520px] max-h-[85vh] overflow-hidden rounded-3xl border border-white/10 bg-black/50 shadow-2xl backdrop-blur-2xl flex flex-col">
        {/* Header */}
        <div className="flex flex-col items-center justify-center px-8 pb-4 pt-8 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10">
            <Building2 size={28} className="text-white" />
          </div>
          <h2 className="mb-1 text-xl font-medium tracking-tight text-white">
            Select Source
          </h2>
          <p className="text-sm text-white/50">
            Choose which repositories to import into your universe.
          </p>
        </div>

        {/* Search */}
        <div className="px-6 pb-3">
          <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
            <Search size={14} className="text-white/40" />
            <input
              type="text"
              placeholder="Search organizations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          {/* Personal Account — Always first */}
          <button
            onClick={onSelectPersonal}
            className="group w-full flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 transition-all hover:bg-white/[0.08] hover:border-white/15"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
              <Globe size={18} />
            </div>
            <div className="flex-1 text-left">
              <div className="text-sm font-medium text-white">
                Personal Account
              </div>
              <div className="text-xs text-white/40">
                All your personal repositories
              </div>
            </div>
            <ArrowRight
              size={14}
              className="text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-white/60"
            />
          </button>

          {/* Loading */}
          {loading && (
            <div className="flex items-center justify-center py-8 text-white/40">
              <Loader2 size={20} className="animate-spin mr-2" />
              <span className="text-sm">Loading organizations...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center justify-center py-6 gap-3">
              <div className="flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
              <button
                onClick={retryLoad}
                className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white transition-colors"
              >
                <RefreshCw size={12} />
                Retry
              </button>
            </div>
          )}

          {/* Organization List */}
          {!loading &&
            !error &&
            filtered.map((org) => (
              <button
                key={org.id}
                onClick={() => onSelectOrg(org.login)}
                className="group w-full flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/5 px-4 py-3 transition-all hover:bg-white/[0.08] hover:border-white/15"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={org.avatar_url}
                  alt={org.login}
                  className="h-10 w-10 rounded-full ring-1 ring-white/10"
                />
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium text-white flex items-center gap-2">
                    {org.login}
                    {org.total_private_repos && org.total_private_repos > 0 && (
                      <Lock size={10} className="text-white/30" />
                    )}
                  </div>
                  <div className="text-xs text-white/40 truncate max-w-[300px]">
                    {org.description || 'No description'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white/50">
                    {org.public_repos ?? '—'} repos
                  </div>
                </div>
                <ArrowRight
                  size={14}
                  className="text-white/20 transition-transform group-hover:translate-x-1 group-hover:text-white/60"
                />
              </button>
            ))}

          {/* Empty State */}
          {!loading && !error && filtered.length === 0 && orgs.length > 0 && (
            <div className="text-center py-8 text-white/30 text-sm">
              No organizations match &quot;{search}&quot;.
            </div>
          )}
          {!loading && !error && orgs.length === 0 && (
            <div className="text-center py-8 text-white/30 text-sm">
              You are not a member of any organizations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
