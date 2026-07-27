import { WorkspaceStorage } from './WorkspaceStorage';
import { usePanelStore } from './PanelController';
import { PanelType } from './PanelRegistry';

export class WorkspaceManager {
  private static instance: WorkspaceManager | null = null;

  public static getInstance(): WorkspaceManager {
    if (!WorkspaceManager.instance) {
      WorkspaceManager.instance = new WorkspaceManager();
    }
    return WorkspaceManager.instance;
  }

  public init(): void {
    const saved = WorkspaceStorage.loadLayout();
    if (saved && saved.openPanels && saved.openPanels.length > 0) {
      usePanelStore.setState({
        panels: saved.openPanels.map((p, idx) => ({
          id: p.id,
          type: p.type as PanelType,
          dockPosition: p.dockPosition,
          isPinned: p.isPinned,
          isMinimized: p.isMinimized,
          zIndex: idx + 1,
          bounds: p.bounds || { x: 100, y: 100, w: 320, h: 450 },
        })),
        activeDockTab: saved.activeDockTab || {
          left: 'panel-explorer',
          right: 'panel-inspector',
        },
      });
    }
  }
}
