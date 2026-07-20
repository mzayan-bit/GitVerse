export type VisualActionType =
  'focus' | 'highlight' | 'zoom' | 'navigate' | 'animate';

export interface VisualAction {
  id: string;
  type: VisualActionType;
  target: string;
  metadata?: Record<string, unknown>;
  timestamp: number;
}

export type ActionCallback = (action: VisualAction) => void;
