import { SavedWorkspaceLayout } from './WorkspaceStorage';
import { PanelInstance } from './PanelController';

export class LayoutSerializer {
  public static serialize(
    panels: PanelInstance[],
    activeTabs: { left?: string; right?: string; bottom?: string }
  ): SavedWorkspaceLayout {
    return {
      version: 1,
      updatedAt: Date.now(),
      openPanels: panels.map((p) => ({
        id: p.id,
        type: p.type,
        dockPosition: p.dockPosition,
        isPinned: p.isPinned,
        isMinimized: p.isMinimized,
        bounds: p.bounds,
      })),
      activeDockTab: activeTabs,
    };
  }
}
