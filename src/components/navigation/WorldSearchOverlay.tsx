import { useState, useEffect } from 'react';
import { Search, Navigation, X, Sparkles } from 'lucide-react';
import { MovementController } from '@/engine/navigation/MovementController';
import * as THREE from 'three';

export interface SearchableEntity {
  id: string;
  name: string;
  type: string;
  position: [number, number, number];
  language?: string;
}

interface WorldSearchOverlayProps {
  entities?: SearchableEntity[];
  isOpen: boolean;
  onClose: () => void;
}

export function WorldSearchOverlay({
  entities = [],
  isOpen,
  onClose,
}: WorldSearchOverlayProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered via parent state if available
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = entities.filter(
    (e) =>
      e.name.toLowerCase().includes(query.toLowerCase()) ||
      e.id.toLowerCase().includes(query.toLowerCase()) ||
      e.language?.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (entity: SearchableEntity) => {
    MovementController.getInstance().flyToTarget({
      entityPosition: new THREE.Vector3(...entity.position),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/60 backdrop-blur-md pointer-events-auto">
      <div className="w-full max-w-xl bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-white/10 bg-white/5 gap-3">
          <Search className="w-5 h-5 text-indigo-400" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search universe repositories, microservices, or nodes..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-white rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-white/5">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-gray-500 flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-gray-600" />
              <span>
                No universe entities found matching &quot;{query}&quot;
              </span>
            </div>
          ) : (
            filtered.map((entity) => (
              <button
                key={entity.id}
                onClick={() => handleSelect(entity)}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-600/20 hover:border-indigo-500/30 border border-transparent transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                    <Navigation className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-200 group-hover:text-white">
                      {entity.name}
                    </p>
                    <p className="text-[10px] text-gray-500 font-mono">
                      {entity.type}{' '}
                      {entity.language ? `• ${entity.language}` : ''}
                    </p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Fly To →
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
