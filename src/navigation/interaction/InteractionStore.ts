import { create } from 'zustand';

export type CursorHint =
  'default' | 'pointer' | 'grab' | 'grabbing' | 'crosshair' | 'zoom-in';

export interface InteractionTarget {
  entityId: string;
  entityType: string;
  distance: number;
  point: [number, number, number];
}

interface InteractionState {
  // Hover
  hoveredTarget: InteractionTarget | null;
  cursorHint: CursorHint;

  // Selection
  selectedTargets: string[];
  selectionPulsePhase: number;

  // Breadcrumb navigation
  breadcrumbs: Array<{ entityId: string; label: string }>;

  // Context
  contextMenuTarget: InteractionTarget | null;

  // Actions
  setHovered: (target: InteractionTarget | null) => void;
  setCursorHint: (hint: CursorHint) => void;
  selectTarget: (entityId: string) => void;
  deselectTarget: (entityId: string) => void;
  clearSelection: () => void;
  pushBreadcrumb: (entityId: string, label: string) => void;
  popBreadcrumb: () => void;
  clearBreadcrumbs: () => void;
  setContextMenu: (target: InteractionTarget | null) => void;
}

export const useInteractionStore = create<InteractionState>((set) => ({
  hoveredTarget: null,
  cursorHint: 'default',
  selectedTargets: [],
  selectionPulsePhase: 0,
  breadcrumbs: [],
  contextMenuTarget: null,

  setHovered: (target) => {
    set({ hoveredTarget: target });
    // Update actual DOM cursor
    if (target) {
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  },

  setCursorHint: (hint) => {
    set({ cursorHint: hint });
    document.body.style.cursor = hint === 'default' ? 'default' : hint;
  },

  selectTarget: (entityId) =>
    set((s) => ({
      selectedTargets: s.selectedTargets.includes(entityId)
        ? s.selectedTargets
        : [...s.selectedTargets, entityId],
    })),

  deselectTarget: (entityId) =>
    set((s) => ({
      selectedTargets: s.selectedTargets.filter((id) => id !== entityId),
    })),

  clearSelection: () => set({ selectedTargets: [] }),

  pushBreadcrumb: (entityId, label) =>
    set((s) => ({
      breadcrumbs: [
        ...s.breadcrumbs.filter((b) => b.entityId !== entityId),
        { entityId, label },
      ],
    })),

  popBreadcrumb: () =>
    set((s) => ({
      breadcrumbs: s.breadcrumbs.slice(0, -1),
    })),

  clearBreadcrumbs: () => set({ breadcrumbs: [] }),

  setContextMenu: (target) => set({ contextMenuTarget: target }),
}));
