export type PanelType =
  | 'explorer'
  | 'inspector'
  | 'graph'
  | 'ai'
  | 'simulation'
  | 'metrics'
  | 'timeline'
  | 'activity'
  | 'search'
  | 'bookmarks'
  | 'investigations'
  | 'properties'
  | 'cosmos';

export interface PanelMetadata {
  type: PanelType;
  title: string;
  iconName: string;
  defaultDock: 'left' | 'right' | 'bottom' | 'floating';
  defaultWidth: number;
  defaultHeight: number;
}

export const PANEL_REGISTRY: Record<PanelType, PanelMetadata> = {
  cosmos: {
    type: 'cosmos',
    title: 'Cosmos Control Center',
    iconName: 'Sparkles',
    defaultDock: 'right',
    defaultWidth: 340,
    defaultHeight: 540,
  },
  explorer: {
    type: 'explorer',
    title: 'Repository Explorer',
    iconName: 'FolderTree',
    defaultDock: 'left',
    defaultWidth: 320,
    defaultHeight: 500,
  },
  inspector: {
    type: 'inspector',
    title: 'Universe Inspector',
    iconName: 'Globe',
    defaultDock: 'right',
    defaultWidth: 360,
    defaultHeight: 520,
  },
  graph: {
    type: 'graph',
    title: 'Knowledge Graph',
    iconName: 'Network',
    defaultDock: 'right',
    defaultWidth: 340,
    defaultHeight: 480,
  },
  ai: {
    type: 'ai',
    title: 'AI Copilot Assistant',
    iconName: 'Bot',
    defaultDock: 'left',
    defaultWidth: 340,
    defaultHeight: 550,
  },
  simulation: {
    type: 'simulation',
    title: 'Simulation Platform',
    iconName: 'Cpu',
    defaultDock: 'bottom',
    defaultWidth: 600,
    defaultHeight: 280,
  },
  metrics: {
    type: 'metrics',
    title: 'Metrics & Observability',
    iconName: 'BarChart2',
    defaultDock: 'bottom',
    defaultWidth: 600,
    defaultHeight: 260,
  },
  timeline: {
    type: 'timeline',
    title: 'Evolution Timeline',
    iconName: 'History',
    defaultDock: 'bottom',
    defaultWidth: 550,
    defaultHeight: 240,
  },
  activity: {
    type: 'activity',
    title: 'Live Activity Feed',
    iconName: 'Activity',
    defaultDock: 'left',
    defaultWidth: 300,
    defaultHeight: 450,
  },
  search: {
    type: 'search',
    title: 'Search Results',
    iconName: 'Search',
    defaultDock: 'left',
    defaultWidth: 320,
    defaultHeight: 400,
  },
  bookmarks: {
    type: 'bookmarks',
    title: 'Saved Bookmarks',
    iconName: 'Bookmark',
    defaultDock: 'right',
    defaultWidth: 300,
    defaultHeight: 380,
  },
  investigations: {
    type: 'investigations',
    title: 'Recent Investigations',
    iconName: 'FileText',
    defaultDock: 'left',
    defaultWidth: 320,
    defaultHeight: 420,
  },
  properties: {
    type: 'properties',
    title: 'Properties Inspector',
    iconName: 'Sliders',
    defaultDock: 'right',
    defaultWidth: 340,
    defaultHeight: 460,
  },
};
