import { useState } from 'react';
import { useThemeManager, THEMES } from '../../rendering/themes/ThemeManager';
import {
  useRendererManager,
  QUALITY_PRESETS,
  POST_FX_PRESETS,
  QualityPreset,
} from '../../rendering/core/RendererManager';
import {
  Settings,
  Image as ImageIcon,
  Monitor,
  Sparkles,
  X,
  Check,
} from 'lucide-react';

export function AppearanceSettings({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'themes' | 'graphics'>('themes');

  const { activeThemeId, setTheme } = useThemeManager();
  const { qualityPreset, setQualityPreset, postFx, toggleEffect } =
    useRendererManager();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm pointer-events-auto">
      <div className="w-full max-w-4xl bg-black/80 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-medium text-white tracking-wide">
              Appearance & Graphics
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-6 pt-4 gap-6 border-b border-white/5">
          <button
            onClick={() => setActiveTab('themes')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'themes' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Theme Gallery
            </span>
            {activeTab === 'themes' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('graphics')}
            className={`pb-3 text-sm font-medium transition-colors relative ${activeTab === 'graphics' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'}`}
          >
            <span className="flex items-center gap-2">
              <Monitor className="w-4 h-4" /> Rendering & Post-FX
            </span>
            {activeTab === 'graphics' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-t-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {activeTab === 'themes' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.values(THEMES).map((theme) => {
                const isActive = activeThemeId === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => setTheme(theme.id)}
                    className={`text-left p-5 rounded-xl border transition-all duration-300 relative overflow-hidden group ${
                      isActive
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.15)]'
                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <div
                      className="absolute top-0 left-0 w-full h-1"
                      style={{
                        background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.secondary})`,
                      }}
                    />
                    <div className="flex justify-between items-start mb-2">
                      <h3
                        className={`text-base font-medium ${isActive ? 'text-indigo-300' : 'text-gray-200'}`}
                      >
                        {theme.name}
                      </h3>
                      {isActive && (
                        <Check className="w-4 h-4 text-indigo-400" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mb-4 h-8">
                      {theme.description}
                    </p>

                    {/* Color Swatches */}
                    <div className="flex gap-2">
                      <div
                        className="w-6 h-6 rounded-full shadow-inner border border-white/10"
                        style={{ background: theme.colors.background }}
                        title="Background"
                      />
                      <div
                        className="w-6 h-6 rounded-full shadow-inner border border-white/10"
                        style={{ background: theme.colors.primary }}
                        title="Primary"
                      />
                      <div
                        className="w-6 h-6 rounded-full shadow-inner border border-white/10"
                        style={{ background: theme.colors.secondary }}
                        title="Secondary"
                      />
                      <div
                        className="w-6 h-6 rounded-full shadow-inner border border-white/10"
                        style={{ background: theme.colors.accent }}
                        title="Accent"
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {activeTab === 'graphics' && (
            <div className="space-y-8 animate-in fade-in">
              {/* Presets */}
              <section>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4 flex items-center gap-2">
                  <Monitor className="w-4 h-4" /> Quality Preset
                </h3>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high', 'ultra'] as QualityPreset[]).map(
                    (preset) => (
                      <button
                        key={preset}
                        onClick={() => setQualityPreset(preset)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium uppercase tracking-wider transition-all ${
                          qualityPreset === preset
                            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]'
                            : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {preset}
                      </button>
                    )
                  )}
                </div>
              </section>

              <hr className="border-white/5" />

              {/* Effects Toggles */}
              <section>
                <h3 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Cinematic Post-Processing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(postFx).map(([key, effect]) => {
                    const typedKey = key as keyof typeof postFx;
                    return (
                      <div
                        key={key}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-200 capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Enable or disable {key} effect
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            toggleEffect(typedKey, !effect.enabled)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            effect.enabled ? 'bg-indigo-500' : 'bg-gray-700'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              effect.enabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
