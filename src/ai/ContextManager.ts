export interface SpatialAIContext {
  selectedEntityId?: string;
  selectedEntityName?: string;
  selectedEntityType?:
    'organization' | 'team' | 'repository' | 'branch' | 'deployment';
  hoveredEntityId?: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  activeOrgId?: string;
  activeOrgName?: string;
  activePanel?: string;
  highlightedEntityIds: string[];
}

export class ContextManager {
  private static instance: ContextManager | null = null;

  private currentContext: SpatialAIContext = {
    cameraPosition: [0, 400, 800],
    cameraTarget: [0, 0, 0],
    highlightedEntityIds: [],
  };

  public static getInstance(): ContextManager {
    if (!ContextManager.instance) {
      ContextManager.instance = new ContextManager();
    }
    return ContextManager.instance;
  }

  public updateContext(partial: Partial<SpatialAIContext>): void {
    this.currentContext = { ...this.currentContext, ...partial };
  }

  public getContext(): SpatialAIContext {
    return this.currentContext;
  }

  public setHighlightedEntities(ids: string[]): void {
    this.currentContext.highlightedEntityIds = ids;
  }

  public clearHighlights(): void {
    this.currentContext.highlightedEntityIds = [];
  }
}
