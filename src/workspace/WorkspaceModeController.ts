export type WorkspaceMode =
  'EXPLORE' | 'ARCHITECTURE' | 'OPERATIONS' | 'EXTENSIONS';

export interface WorkspaceModeInfo {
  id: WorkspaceMode;
  name: string;
  iconName: string;
  description: string;
  primaryPanels: string[];
}

export class WorkspaceModeController {
  private static instance: WorkspaceModeController | null = null;
  private currentMode: WorkspaceMode = 'EXPLORE';
  private listeners: Array<(mode: WorkspaceMode) => void> = [];

  public static MODES: Record<WorkspaceMode, WorkspaceModeInfo> = {
    EXPLORE: {
      id: 'EXPLORE',
      name: 'Explore 3D',
      iconName: 'Compass',
      description: 'Immersive 3D universe exploration with clean floating HUD',
      primaryPanels: ['cosmos', 'graphics'],
    },
    ARCHITECTURE: {
      id: 'ARCHITECTURE',
      name: 'Architecture',
      iconName: 'Network',
      description:
        'System dependency mesh, risk scoring, and layer violation analysis',
      primaryPanels: ['graph', 'inspector'],
    },
    OPERATIONS: {
      id: 'OPERATIONS',
      name: 'Operations',
      iconName: 'Activity',
      description:
        'Telemetry metrics, CI/CD deployments, and incident monitoring',
      primaryPanels: ['metrics', 'activity'],
    },
    EXTENSIONS: {
      id: 'EXTENSIONS',
      name: 'Extensions',
      iconName: 'Package',
      description: 'Marketplace plugins, MCP connectors, and developer tools',
      primaryPanels: ['marketplace'],
    },
  };

  public static getInstance(): WorkspaceModeController {
    if (!WorkspaceModeController.instance) {
      WorkspaceModeController.instance = new WorkspaceModeController();
    }
    return WorkspaceModeController.instance;
  }

  public getMode(): WorkspaceMode {
    return this.currentMode;
  }

  public setMode(mode: WorkspaceMode): void {
    if (this.currentMode !== mode) {
      this.currentMode = mode;
      this.listeners.forEach((fn) => fn(mode));
    }
  }

  public subscribe(listener: (mode: WorkspaceMode) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getActiveModeInfo(): WorkspaceModeInfo {
    return WorkspaceModeController.MODES[this.currentMode];
  }
}
