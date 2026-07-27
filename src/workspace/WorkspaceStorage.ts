const STORAGE_KEY = 'gitverse_workspace_layout_v1';

export interface SavedWorkspaceLayout {
  version: number;
  updatedAt: number;
  openPanels: Array<{
    id: string;
    type: string;
    dockPosition: 'left' | 'right' | 'bottom' | 'floating';
    isPinned: boolean;
    isMinimized: boolean;
    bounds?: { x: number; y: number; w: number; h: number };
  }>;
  activeDockTab: {
    left?: string;
    right?: string;
    bottom?: string;
  };
}

export class WorkspaceStorage {
  public static saveLayout(layout: SavedWorkspaceLayout): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
    } catch (e) {
      console.warn('Failed to save workspace layout to localStorage', e);
    }
  }

  public static loadLayout(): SavedWorkspaceLayout | null {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? (JSON.parse(data) as SavedWorkspaceLayout) : null;
    } catch (e) {
      console.warn('Failed to load workspace layout', e);
      return null;
    }
  }

  public static exportJSON(layout: SavedWorkspaceLayout): string {
    return JSON.stringify(layout, null, 2);
  }

  public static importJSON(jsonString: string): SavedWorkspaceLayout | null {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && parsed.openPanels) {
        return parsed as SavedWorkspaceLayout;
      }
    } catch (e) {
      console.error('Invalid JSON workspace format', e);
    }
    return null;
  }
}
