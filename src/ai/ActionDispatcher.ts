import { NavigationAgent } from './NavigationAgent';
import { ContextManager } from './ContextManager';
import { usePanelStore } from '@/workspace/PanelController';

export class ActionDispatcher {
  public static dispatchNavigation(
    targetPosition: [number, number, number],
    targetCenter: [number, number, number]
  ): void {
    NavigationAgent.flyTo(targetPosition, targetCenter);
  }

  public static dispatchHighlightNodes(nodeIds: string[]): void {
    ContextManager.getInstance().setHighlightedEntities(nodeIds);
  }

  public static openInspectorPanel(): void {
    usePanelStore.getState().openPanel('inspector');
  }

  public static openGraphPanel(): void {
    usePanelStore.getState().openPanel('graph');
  }
}
