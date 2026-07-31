import { create } from 'zustand';
import { PanelType, PANEL_REGISTRY } from './PanelRegistry';
import { WorkspaceStorage } from './WorkspaceStorage';
import { LayoutSerializer } from './LayoutSerializer';

export type DockPosition = 'left' | 'right' | 'bottom' | 'floating';

export interface PanelInstance {
  id: string;
  type: PanelType;
  dockPosition: DockPosition;
  isPinned: boolean;
  isMinimized: boolean;
  zIndex: number;
  bounds: { x: number; y: number; w: number; h: number };
}

interface PanelState {
  panels: PanelInstance[];
  activeDockTab: {
    left?: string;
    right?: string;
    bottom?: string;
  };
  highestZIndex: number;

  openPanel: (type: PanelType, dock?: DockPosition) => void;
  closePanel: (id: string) => void;
  togglePin: (id: string) => void;
  toggleMinimize: (id: string) => void;
  setDockPosition: (id: string, dock: DockPosition) => void;
  setActiveDockTab: (dock: 'left' | 'right' | 'bottom', id: string) => void;
  updateBounds: (
    id: string,
    bounds: Partial<{ x: number; y: number; w: number; h: number }>
  ) => void;
  bringToFront: (id: string) => void;
  restoreDefaultLayout: () => void;
}

const DEFAULT_PANELS: PanelInstance[] = [
  {
    id: 'panel-explorer',
    type: 'explorer',
    dockPosition: 'left',
    isPinned: true,
    isMinimized: false,
    zIndex: 1,
    bounds: { x: 80, y: 80, w: 320, h: 500 },
  },
  {
    id: 'panel-inspector',
    type: 'inspector',
    dockPosition: 'right',
    isPinned: true,
    isMinimized: false,
    zIndex: 2,
    bounds: { x: 800, y: 80, w: 360, h: 520 },
  },
];

export const usePanelStore = create<PanelState>((set, get) => ({
  panels: DEFAULT_PANELS,
  activeDockTab: {
    left: 'panel-explorer',
    right: 'panel-inspector',
  },
  highestZIndex: 10,

  openPanel: (type, requestedDock) => {
    const state = get();
    const existing = state.panels.find((p) => p.type === type);
    if (existing) {
      state.bringToFront(existing.id);
      if (existing.isMinimized) state.toggleMinimize(existing.id);
      return;
    }

    const meta = PANEL_REGISTRY[type];
    const dock = requestedDock || meta.defaultDock;
    const newId = `panel-${type}-${Date.now()}`;
    const newZ = state.highestZIndex + 1;

    const newPanel: PanelInstance = {
      id: newId,
      type,
      dockPosition: dock,
      isPinned: false,
      isMinimized: false,
      zIndex: newZ,
      bounds: {
        x: Math.max(100, Math.random() * 400),
        y: Math.max(100, Math.random() * 200),
        w: meta.defaultWidth,
        h: meta.defaultHeight,
      },
    };

    const nextPanels = [...state.panels, newPanel];
    const nextActiveTabs = { ...state.activeDockTab };
    if (dock !== 'floating') {
      nextActiveTabs[dock] = newId;
    }

    set({
      panels: nextPanels,
      activeDockTab: nextActiveTabs,
      highestZIndex: newZ,
    });

    WorkspaceStorage.saveLayout(
      LayoutSerializer.serialize(nextPanels, nextActiveTabs)
    );
  },

  closePanel: (id) => {
    const state = get();
    const nextPanels = state.panels.filter((p) => p.id !== id);
    set({ panels: nextPanels });
    WorkspaceStorage.saveLayout(
      LayoutSerializer.serialize(nextPanels, state.activeDockTab)
    );
  },

  togglePin: (id) => {
    set((s) => ({
      panels: s.panels.map((p) =>
        p.id === id ? { ...p, isPinned: !p.isPinned } : p
      ),
    }));
  },

  toggleMinimize: (id) => {
    set((s) => ({
      panels: s.panels.map((p) =>
        p.id === id ? { ...p, isMinimized: !p.isMinimized } : p
      ),
    }));
  },

  setDockPosition: (id, dock) => {
    const state = get();
    const nextPanels = state.panels.map((p) =>
      p.id === id ? { ...p, dockPosition: dock } : p
    );
    const nextActiveTabs = { ...state.activeDockTab };
    if (dock !== 'floating') nextActiveTabs[dock] = id;

    set({ panels: nextPanels, activeDockTab: nextActiveTabs });
    WorkspaceStorage.saveLayout(
      LayoutSerializer.serialize(nextPanels, nextActiveTabs)
    );
  },

  setActiveDockTab: (dock, id) => {
    set((s) => ({
      activeDockTab: { ...s.activeDockTab, [dock]: id },
    }));
  },

  updateBounds: (id, bounds) => {
    set((s) => ({
      panels: s.panels.map((p) =>
        p.id === id ? { ...p, bounds: { ...p.bounds, ...bounds } } : p
      ),
    }));
  },

  bringToFront: (id) => {
    const nextZ = get().highestZIndex + 1;
    set((s) => ({
      highestZIndex: nextZ,
      panels: s.panels.map((p) => (p.id === id ? { ...p, zIndex: nextZ } : p)),
    }));
  },

  restoreDefaultLayout: () => {
    set({
      panels: DEFAULT_PANELS,
      activeDockTab: { left: 'panel-explorer', right: 'panel-inspector' },
      highestZIndex: 10,
    });
  },
}));
