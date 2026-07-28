import { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Globe,
  Layers,
  Eye,
  RefreshCw,
  Share2,
  Database,
} from 'lucide-react';
import { GalaxyEngine } from '@/engine/universe/GalaxyEngine';

export function CosmosControlPanel() {
  const engine = GalaxyEngine.getInstance();
  const prefs = engine.getPreferences();

  const [seedInput, setSeedInput] = useState('gitverse-cosmos-prime');
  const [stellarDensity, setStellarDensity] = useState(prefs.stellarDensity);
  const [armCount, setArmCount] = useState(prefs.armCount);
  const [graphLayout, setGraphLayout] = useState(prefs.graphLayoutEnabled);
  const [bloomIntensity, setBloomIntensity] = useState(prefs.bloomIntensity);
  const [particleDensity, setParticleDensity] = useState(prefs.particleDensity);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const handleRegenerate = () => {
    engine.reseedUniverse(seedInput);
    engine.updatePreferences({
      stellarDensity,
      armCount,
      graphLayoutEnabled: graphLayout,
      bloomIntensity,
      particleDensity,
    });
    setSaveStatus('Universe Regenerated!');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleSave = () => {
    const ok = engine.saveCurrentState();
    if (ok) {
      setSaveStatus('Saved to LocalStorage!');
    } else {
      setSaveStatus('Save Failed');
    }
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="space-y-4 text-xs font-sans text-gray-200 select-none">
      {/* Hero Overview */}
      <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-cyan-400 font-semibold text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Procedural Engineering Cosmos</span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5 font-mono">
            Seed: {seedInput}
          </p>
        </div>
        <button
          onClick={handleRegenerate}
          className="px-2.5 py-1.5 rounded bg-cyan-500 text-black font-medium text-xs hover:bg-cyan-400 flex items-center gap-1 transition-all shadow-[0_0_12px_rgba(0,240,255,0.4)]"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Regenerate</span>
        </button>
      </div>

      {/* Universe Settings */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Globe className="w-3.5 h-3.5" />
          <span>Universe Settings</span>
        </div>
        <div className="space-y-1">
          <label className="text-gray-400 block text-[11px]">
            Deterministic Seed
          </label>
          <input
            type="text"
            value={seedInput}
            onChange={(e) => setSeedInput(e.target.value)}
            className="w-full bg-black/60 border border-cyan-500/30 rounded px-2 py-1 font-mono text-cyan-200 focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      {/* Galaxy Explorer */}
      <div className="space-y-2 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>Galaxy Explorer Stats</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 rounded bg-white/5 border border-white/10">
            <span className="text-gray-400 block text-[10px]">
              Active Galaxies
            </span>
            <span className="text-base font-bold font-mono text-cyan-300">
              {engine.getAllGalaxies().length || 1}
            </span>
          </div>
          <div className="p-2 rounded bg-white/5 border border-white/10">
            <span className="text-gray-400 block text-[10px]">
              Sector Chunk Size
            </span>
            <span className="text-base font-bold font-mono text-purple-300">
              1,200 u
            </span>
          </div>
        </div>
      </div>

      {/* Generation Controls */}
      <div className="space-y-2.5 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Sliders className="w-3.5 h-3.5" />
          <span>Generation Controls</span>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-300">
            <span>Stellar Density</span>
            <span className="font-mono text-cyan-400">
              {stellarDensity.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.5"
            max="3.0"
            step="0.1"
            value={stellarDensity}
            onChange={(e) => setStellarDensity(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-300">
            <span>Spiral Arms Count</span>
            <span className="font-mono text-cyan-400">{armCount}</span>
          </div>
          <input
            type="range"
            min="2"
            max="8"
            step="1"
            value={armCount}
            onChange={(e) => setArmCount(parseInt(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] text-gray-300">Graph-Aware Layout</span>
          <button
            onClick={() => setGraphLayout(!graphLayout)}
            className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
              graphLayout ? 'bg-cyan-500' : 'bg-gray-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-black transition-transform ${
                graphLayout ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Rendering Settings */}
      <div className="space-y-2.5 border-t border-white/10 pt-3">
        <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
          <Eye className="w-3.5 h-3.5" />
          <span>Rendering Settings</span>
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-300">
            <span>Atmosphere Bloom</span>
            <span className="font-mono text-cyan-400">
              {bloomIntensity.toFixed(1)}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="2.0"
            step="0.1"
            value={bloomIntensity}
            onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
          />
        </div>

        <div>
          <div className="flex justify-between text-[11px] text-gray-300">
            <span>Particle Density</span>
            <span className="font-mono text-cyan-400">
              {particleDensity.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="0.2"
            max="2.0"
            step="0.1"
            value={particleDensity}
            onChange={(e) => setParticleDensity(parseFloat(e.target.value))}
            className="w-full accent-cyan-400 h-1 bg-white/10 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Save / Export Persistence */}
      <div className="border-t border-white/10 pt-3 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white font-medium flex items-center justify-center gap-1 transition-colors"
        >
          <Database className="w-3 h-3 text-cyan-400" />
          <span>Save Persistence</span>
        </button>
        <button
          onClick={() => {
            const dataStr =
              'data:text/json;charset=utf-8,' +
              encodeURIComponent(JSON.stringify(engine.getPreferences()));
            const downloadAnchor = document.createElement('a');
            downloadAnchor.setAttribute('href', dataStr);
            downloadAnchor.setAttribute('download', 'universe_settings.json');
            document.body.appendChild(downloadAnchor);
            downloadAnchor.click();
            downloadAnchor.remove();
          }}
          className="px-2.5 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          title="Export Config"
        >
          <Share2 className="w-3.5 h-3.5 text-purple-300" />
        </button>
      </div>

      {saveStatus && (
        <div className="p-2 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-center text-[11px] animate-pulse">
          {saveStatus}
        </div>
      )}
    </div>
  );
}
