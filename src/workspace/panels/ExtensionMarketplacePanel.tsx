import { useState } from 'react';
import {
  Package,
  CheckCircle,
  XCircle,
  Layers,
  Settings,
  Download,
  Database,
  Radio,
  Search,
} from 'lucide-react';
import { PluginManager } from '@/platform/plugins/PluginManager';
import {
  PluginRegistry,
  RegisteredPlugin,
} from '@/platform/plugins/PluginRegistry';
import {
  MCPProviderRegistry,
  MCPProviderConnector,
} from '@/platform/mcp/MCPProviderRegistry';

export function ExtensionMarketplacePanel() {
  const pluginMgr = PluginManager.getInstance();
  const pluginRegistry = PluginRegistry.getInstance();
  const mcpRegistry = MCPProviderRegistry.getInstance();

  const [activeTab, setActiveTab] = useState<
    'installed' | 'marketplace' | 'mcp'
  >('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [installedPlugins, setInstalledPlugins] = useState<RegisteredPlugin[]>(
    pluginRegistry.getAll()
  );
  const [mcpConnectors, setMcpConnectors] = useState<MCPProviderConnector[]>(
    mcpRegistry.getAll()
  );

  const [selectedPlugin, setSelectedPlugin] = useState<RegisteredPlugin | null>(
    null
  );

  const handleTogglePlugin = (id: string, currentEnabled: boolean) => {
    pluginMgr.togglePlugin(id, !currentEnabled);
    setInstalledPlugins([...pluginRegistry.getAll()]);
  };

  const handleToggleMCP = (id: string) => {
    mcpRegistry.toggleStatus(id);
    setMcpConnectors([...mcpRegistry.getAll()]);
  };

  const categories = [
    'ALL',
    'AI',
    'Providers',
    'Rendering',
    'Workspace',
    'Themes',
    'Metrics',
  ];

  return (
    <div className="flex flex-col h-full text-xs font-sans text-gray-200 select-none space-y-3">
      {/* Header Banner */}
      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white text-sm">
            Extension Hub & MCP Ecosystem
          </span>
        </div>
        <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px] border border-indigo-500/40">
          SDK v2.5
        </span>
      </div>

      {/* Top Nav Tabs */}
      <div className="flex border-b border-white/10 text-[11px] font-medium">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`pb-2 px-3 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'marketplace'
              ? 'border-indigo-500 text-white font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>Marketplace</span>
        </button>

        <button
          onClick={() => setActiveTab('installed')}
          className={`pb-2 px-3 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'installed'
              ? 'border-indigo-500 text-white font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Installed ({installedPlugins.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('mcp')}
          className={`pb-2 px-3 transition-all flex items-center gap-1.5 border-b-2 ${
            activeTab === 'mcp'
              ? 'border-indigo-500 text-white font-semibold'
              : 'border-transparent text-gray-400 hover:text-gray-200'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>MCP Connectors ({mcpConnectors.length})</span>
        </button>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search extensions, MCP providers, SDK plugins..."
            className="w-full bg-black/60 border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
          />
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2" />
        </div>

        {activeTab === 'marketplace' && (
          <div className="flex gap-1 overflow-x-auto custom-scrollbar pb-1 text-[10px]">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2 py-0.5 rounded-full transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
        {/* Marketplace & Installed List */}
        {(activeTab === 'marketplace' || activeTab === 'installed') && (
          <div className="space-y-2">
            {installedPlugins
              .filter(
                (p) =>
                  (selectedCategory === 'ALL' ||
                    p.manifest.category === selectedCategory) &&
                  p.manifest.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase())
              )
              .map((plugin) => (
                <div
                  key={plugin.manifest.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-indigo-500/40 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-sm">
                        {plugin.manifest.name}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[9px] border border-indigo-500/30">
                        v{plugin.manifest.version}
                      </span>
                      <span className="px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-300 text-[9px]">
                        {plugin.manifest.category}
                      </span>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-[11px]">
                      {plugin.manifest.description}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[10px] text-gray-500">
                      <span>By {plugin.manifest.author.name}</span>
                      <span>•</span>
                      <span>
                        Permissions: {plugin.manifest.permissions.join(', ')}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() =>
                        handleTogglePlugin(plugin.manifest.id, plugin.enabled)
                      }
                      className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all flex items-center gap-1 ${
                        plugin.enabled
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {plugin.enabled ? (
                        <>
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Enabled</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 text-gray-400" />
                          <span>Disabled</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setSelectedPlugin(plugin)}
                      className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10"
                      title="Settings"
                    >
                      <Settings className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* MCP Connectors View */}
        {activeTab === 'mcp' && (
          <div className="grid grid-cols-1 gap-2">
            {mcpConnectors
              .filter((c) =>
                c.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((conn) => (
                <div
                  key={conn.id}
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold">
                      {conn.name[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">
                          {conn.name}
                        </span>
                        <span className="text-[9px] text-gray-400 bg-white/5 px-1.5 py-0.5 rounded">
                          {conn.category}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400">
                        {conn.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggleMCP(conn.id)}
                    className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all flex items-center gap-1 ${
                      conn.status === 'CONNECTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <Radio
                      className={`w-3 h-3 ${conn.status === 'CONNECTED' ? 'text-emerald-400 animate-pulse' : 'text-gray-500'}`}
                    />
                    <span>{conn.status}</span>
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Plugin Details Modal Drawer */}
      {selectedPlugin && (
        <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-500/40 space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white text-sm">
              Settings: {selectedPlugin.manifest.name}
            </span>
            <button
              onClick={() => setSelectedPlugin(null)}
              className="text-gray-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
          <p className="text-[11px] text-gray-300">
            Sandbox Isolation Status:{' '}
            <span className="text-emerald-400 font-bold">Active & Secure</span>
          </p>
          <div className="text-[10px] text-gray-400 font-mono">
            Installed at:{' '}
            {new Date(selectedPlugin.installedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
}
