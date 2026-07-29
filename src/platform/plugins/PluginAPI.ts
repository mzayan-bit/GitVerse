import { PluginManifest } from './PluginManifest';
import { PluginPermissions } from './PluginPermissions';
import { PluginStorage } from './PluginStorage';
import { PluginEvents } from './PluginEvents';
import { usePanelStore } from '@/workspace/PanelController';
import { MovementController } from '@/engine/navigation/MovementController';
import { CopilotEngine } from '@/ai/CopilotEngine';
import { RendererCore } from '@/rendering/RendererCore';
import * as THREE from 'three';

export class PluginContext {
  public manifest: PluginManifest;
  public permissions: PluginPermissions;
  public storage: PluginStorage;
  public events: PluginEvents = PluginEvents.getInstance();

  constructor(manifest: PluginManifest) {
    this.manifest = manifest;
    this.permissions = new PluginPermissions(manifest.permissions);
    this.storage = new PluginStorage(manifest.id);
  }

  // Domain APIs
  public workspace = {
    openPanel: (panelType: string) => {
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      usePanelStore.getState().openPanel(panelType as any);
    },
    closePanel: (panelId: string) => {
      usePanelStore.getState().closePanel(panelId);
    },
  };

  public navigation = {
    flyTo: (position: [number, number, number]) => {
      MovementController.getInstance().flyToTarget({
        entityPosition: new THREE.Vector3(...position),
        paddingFactor: 2.0,
      });
    },
  };

  public ai = {
    askCopilot: (prompt: string) => {
      return CopilotEngine.getInstance().processPrompt(prompt);
    },
  };

  public rendering = {
    getStats: () => {
      return RendererCore.getInstance().profiler.getStats();
    },
  };
}
