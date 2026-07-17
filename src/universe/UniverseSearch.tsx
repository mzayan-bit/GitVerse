'use client';

import { useState, useMemo, useEffect } from 'react';
import { Search, Map, Database } from 'lucide-react';
import { useUniverseManager } from './UniverseManager';
import { useEntityManager } from '@/entities/EntityManager';
import { RepositoryDomainModel } from '@/domain/RepositoryModels';

export function UniverseSearch() {
  const { isBuilt, hierarchy, focusEntity } = useUniverseManager();
  const { entities } = useEntityManager();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Keyboard shortcut to open search (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const results = useMemo(() => {
    if (!query) return [];

    const q = query.toLowerCase();
    const matches = [];

    // Search planets (repositories)
    for (const planet of hierarchy.planets) {
      const entity = entities[planet.id];
      if (!entity || !entity.metadata?.repository) continue;

      const repo = entity.metadata.repository as RepositoryDomainModel;

      if (
        repo.name.toLowerCase().includes(q) ||
        repo.owner.toLowerCase().includes(q) ||
        repo.primaryLanguage.toLowerCase().includes(q) ||
        repo.topics.some((t) => t.toLowerCase().includes(q))
      ) {
        matches.push({
          id: planet.id,
          type: 'planet',
          name: repo.name,
          subtitle: `${repo.owner} • ${repo.primaryLanguage}`,
          icon: <Database size={12} className="text-emerald-400" />,
        });
      }

      if (matches.length > 10) break; // Limit results
    }

    // Search galaxies (organizations)
    if (matches.length < 10) {
      for (const galaxy of hierarchy.galaxies) {
        const entity = entities[galaxy.id];
        if (!entity) continue;

        if (entity.name.toLowerCase().includes(q)) {
          matches.push({
            id: galaxy.id,
            type: 'galaxy',
            name: entity.name,
            subtitle: 'Organization',
            icon: <Map size={12} className="text-blue-400" />,
          });
        }
      }
    }

    return matches;
  }, [query, hierarchy, entities]);

  if (!isBuilt) return null;

  return (
    <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md font-sans">
      <div
        className={`bg-black/50 backdrop-blur-xl border transition-colors duration-200 ${isOpen ? 'border-white/20' : 'border-white/10'} rounded-2xl overflow-hidden shadow-2xl`}
      >
        <div className="flex items-center px-4 py-3">
          <Search size={16} className="text-white/40 mr-3" />
          <input
            type="text"
            placeholder="Search universe (⌘K)..."
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/30"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
          />
          <div className="flex items-center justify-center bg-white/10 rounded px-1.5 py-0.5 text-[10px] text-white/40 font-medium font-mono">
            ⌘K
          </div>
        </div>

        {isOpen && query && (
          <div className="border-t border-white/10 max-h-80 overflow-y-auto">
            {results.length > 0 ? (
              <div className="p-2 space-y-1">
                {results.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      focusEntity(result.id);
                      setIsOpen(false);
                      setQuery('');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-left"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5">
                      {result.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white/90">
                        {result.name}
                      </div>
                      <div className="text-xs text-white/40">
                        {result.subtitle}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-white/40">
                No matching celestial bodies found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
