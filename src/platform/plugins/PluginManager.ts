import { PluginManifest } from './PluginManifest';
import { PluginLoader } from './PluginLoader';
import { PluginRegistry, RegisteredPlugin } from './PluginRegistry';

export class PluginManager {
  private static instance: PluginManager | null = null;

  private constructor() {
    this.initDefaultPlugins();
  }

  public static getInstance(): PluginManager {
    if (!PluginManager.instance) {
      PluginManager.instance = new PluginManager();
    }
    return PluginManager.instance;
  }

  private async initDefaultPlugins(): Promise<void> {
    const defaultManifests: PluginManifest[] = [
      {
        id: 'github-copilot-connector',
        name: 'GitHub Copilot MCP Connector',
        version: '1.4.0',
        description:
          'Connects GitVerse 3D universe directly to GitHub API & Copilot Workspace.',
        author: { name: 'GitVerse Core Team', url: 'https://gitverse.dev' },
        category: 'Providers',
        permissions: ['read:graph', 'execute:ai', 'network:fetch'],
        entryPoint: 'index.js',
      },
      {
        id: 'kubernetes-telemetry',
        name: 'Kubernetes Pod Topology',
        version: '2.1.0',
        description:
          'Renders real-time K8s pod clusters and service mesh topologies as 3D star systems.',
        author: { name: 'Cloud Native Ops', url: 'https://k8s.io' },
        category: 'Metrics',
        permissions: ['render:3d', 'network:fetch', 'read:graph'],
        entryPoint: 'main.js',
      },
      {
        id: 'grafana-observability',
        name: 'Grafana & OpenTelemetry Overlay',
        version: '1.0.5',
        description:
          'Overlays real-time latency and error rates directly onto repository planets.',
        author: { name: 'Observability Inc' },
        category: 'Metrics',
        permissions: ['render:3d', 'read:graph'],
        entryPoint: 'overlay.js',
      },
    ];

    for (const manifest of defaultManifests) {
      try {
        await PluginLoader.loadPlugin(manifest);
      } catch (err) {
        console.error('Failed to load default plugin:', err);
      }
    }
  }

  public async installPlugin(
    manifest: PluginManifest
  ): Promise<RegisteredPlugin> {
    return PluginLoader.loadPlugin(manifest);
  }

  public async uninstallPlugin(id: string): Promise<boolean> {
    return PluginLoader.unloadPlugin(id);
  }

  public togglePlugin(id: string, enabled: boolean): void {
    const plugin = PluginRegistry.getInstance().get(id);
    if (plugin) {
      plugin.enabled = enabled;
      if (enabled) plugin.sandbox.activate();
      else plugin.sandbox.deactivate();
    }
  }

  public getInstalledPlugins(): RegisteredPlugin[] {
    return PluginRegistry.getInstance().getAll();
  }
}
