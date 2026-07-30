export type WorkspaceMode =
  'EXPLORE' | 'ANALYZE' | 'AI' | 'PRESENTATION' | 'DEV';

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
      name: 'Explore Universe',
      iconName: 'Compass',
      description:
        'Explore the 3D universe, star systems, and repository planets',
      primaryPanels: ['cosmos', 'explorer'],
    },
    ANALYZE: {
      id: 'ANALYZE',
      name: 'Analyze Graph',
      iconName: 'Network',
      description:
        'Architecture analysis, dependency mesh, and impact wave scoring',
      primaryPanels: ['graph', 'inspector'],
    },
    AI: {
      id: 'AI',
      name: 'Spatial AI',
      iconName: 'Bot',
      description: 'Natural language spatial copilot and voice assistant',
      primaryPanels: ['ai'],
    },
    PRESENTATION: {
      id: 'PRESENTATION',
      name: 'Presentation',
      iconName: 'Video',
      description: 'Cinematic camera tours and Keynote storytelling',
      primaryPanels: ['demo'],
    },
    DEV: {
      id: 'DEV',
      name: 'Dev & Operations',
      iconName: 'Activity',
      description:
        'Telemetry metrics, CI/CD deployments, and performance diagnostics',
      primaryPanels: ['metrics', 'activity'],
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
