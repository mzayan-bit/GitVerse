export type InvestigationStatus =
  'open' | 'in_progress' | 'resolved' | 'archived';

export interface Evidence {
  id: string;
  type: 'repository' | 'trace' | 'metric' | 'screenshot' | 'log' | 'note';
  label: string;
  entityId?: string;
  data: Record<string, unknown>;
  addedBy: string;
  addedAt: number;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  ownerName: string;
  status: 'todo' | 'in_progress' | 'done';
  createdAt: number;
  completedAt?: number;
}

export interface InvestigationTimeline {
  id: string;
  timestamp: number;
  authorId: string;
  authorName: string;
  action: string;
  details: string;
}

export interface Investigation {
  id: string;
  title: string;
  description: string;
  status: InvestigationStatus;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
  evidence: Evidence[];
  actionItems: ActionItem[];
  timeline: InvestigationTimeline[];
  pinnedEntityIds: string[];
  participantIds: string[];
}
