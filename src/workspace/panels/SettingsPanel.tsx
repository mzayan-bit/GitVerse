import { useState } from 'react';
import {
  Settings,
  Palette,
  Sliders,
  Shield,
  Keyboard,
  Check,
} from 'lucide-react';
import { useThemeManager } from '@/rendering/themes/ThemeManager';
import { FeatureFlags } from '@/platform/hardening/FeatureFlags';

export function SettingsPanel() {
  const setTheme = useThemeManager.getState().setTheme;
  const activeTheme = useThemeManager.getState().activeTheme;
  const flags = FeatureFlags.getInstance();

  const [activeTab, setActiveTab] = useState<
    'general' | 'appearance' | 'keybindings' | 'security'
  >('general');
  const [activeFlags, setActiveFlags] = useState(flags.getAll());

  const handleToggleFlag = (key: keyof typeof activeFlags) => {
    const nextVal = !activeFlags[key];
    flags.setFlag(key, nextVal);
    setActiveFlags(flags.getAll());
  };

  return (
    <div className="flex flex-col h-full text-xs font-sans text-gray-200 select-none space-y-3">
      {/* Header Banner */}
      <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-purple-400" />
          <div>
            <span className="font-bold text-sm text-white block">
              Platform Settings & Preferences
            </span>
            <span className="text-[10px] text-purple-300 font-mono">
              GitVerse System Preferences
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('general')}
          className={`pb-2 px-3 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'general'
              ? 'border-purple-500 text-white font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>General</span>
        </button>

        <button
          onClick={() => setActiveTab('appearance')}
          className={`pb-2 px-3 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'appearance'
              ? 'border-purple-500 text-white font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Themes</span>
        </button>

        <button
          onClick={() => setActiveTab('keybindings')}
          className={`pb-2 px-3 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'keybindings'
              ? 'border-purple-500 text-white font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>Shortcuts</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-2 px-3 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'security'
              ? 'border-purple-500 text-white font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
        {activeTab === 'general' && (
          <div className="space-y-2">
            <span className="text-[10px] text-gray-400 font-medium block">
              Feature Configurations:
            </span>
            {(Object.keys(activeFlags) as Array<keyof typeof activeFlags>).map(
              (key) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10"
                >
                  <span className="text-gray-200 font-mono text-[11px]">
                    {key}
                  </span>
                  <button
                    onClick={() => handleToggleFlag(key)}
                    className={`w-8 h-4 rounded-full transition-colors relative p-0.5 ${
                      activeFlags[key] ? 'bg-purple-600' : 'bg-gray-700'
                    }`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full bg-white transition-transform ${
                        activeFlags[key] ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              )
            )}
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-2">
            <span className="text-[10px] text-gray-400 font-medium block">
              Select 3D Universe Theme:
            </span>
            {[
              {
                id: 'deep_space',
                name: 'Deep Space Cosmic',
                desc: 'Default dark nebula with cyan orbital links',
              },
              {
                id: 'cyberpunk_neon',
                name: 'Cyberpunk Neon',
                desc: 'High-contrast glowing pink and emerald mesh',
              },
              {
                id: 'solar_flare',
                name: 'Solar Flare Gold',
                desc: 'Warm amber solar lighting and glowing corona',
              },
            ].map((t) => (
              <button
                key={t.id}
                /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                onClick={() => setTheme(t.id as any)}
                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  activeTheme?.id === t.id
                    ? 'bg-purple-600/30 border-purple-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 text-gray-300'
                }`}
              >
                <div>
                  <span className="font-bold text-xs block">{t.name}</span>
                  <span className="text-[10px] text-gray-400">{t.desc}</span>
                </div>
                {activeTheme?.id === t.id && (
                  <Check className="w-4 h-4 text-purple-400" />
                )}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'keybindings' && (
          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-medium block">
              Global Keyboard Shortcuts:
            </span>
            {[
              {
                key: '⌘ K / Ctrl K',
                desc: 'Open Command Palette & Global Search',
              },
              { key: 'ESC', desc: 'Dismiss active panels / overlays' },
              {
                key: 'Mouse Wheel',
                desc: 'Smooth 3D Zoom In / Out with inertia',
              },
              { key: 'Right Click Drag', desc: 'Rotate 3D Universe Camera' },
              { key: 'Middle Click', desc: 'Reset Camera Position' },
              { key: 'Double Click', desc: 'Fly-To Focused Planet' },
            ].map((kb, i) => (
              <div
                key={i}
                className="p-2 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-[11px]"
              >
                <span className="text-gray-300">{kb.desc}</span>
                <kbd className="px-2 py-0.5 rounded bg-white/10 font-mono text-[10px] text-purple-300 border border-white/10">
                  {kb.key}
                </kbd>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
              <span className="font-bold text-emerald-300 block text-xs">
                Sandbox Isolation: Active
              </span>
              <span className="text-[10px] text-gray-300">
                Third-party plugins execute in isolated sandbox environments.
              </span>
            </div>
            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30">
              <span className="font-bold text-purple-300 block text-xs">
                JWT Token Security: RS256
              </span>
              <span className="text-[10px] text-gray-300">
                All MCP provider credentials encrypted at rest.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
