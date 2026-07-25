import {
  Investigation,
  InvestigationStatus,
  Evidence,
  ActionItem,
  InvestigationTimeline,
} from './types';

/**
 * InvestigationManager — Manages collaborative investigation workspaces
 * for incident response, debugging sessions, and architecture reviews.
 */
export class InvestigationManager {
  private static instance: InvestigationManager;
  private investigations: Map<string, Investigation> = new Map();

  private constructor() {}

  public static getInstance(): InvestigationManager {
    if (!InvestigationManager.instance) {
      InvestigationManager.instance = new InvestigationManager();
    }
    return InvestigationManager.instance;
  }

  // ── CRUD ────────────────────────────────────────────────────────────

  public create(
    title: string,
    description: string,
    createdBy: string
  ): Investigation {
    const investigation: Investigation = {
      id: crypto.randomUUID(),
      title,
      description,
      status: 'open',
      createdBy,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      evidence: [],
      actionItems: [],
      timeline: [],
      pinnedEntityIds: [],
      participantIds: [createdBy],
    };

    this.investigations.set(investigation.id, investigation);
    this.addTimelineEntry(
      investigation.id,
      createdBy,
      createdBy,
      'created investigation',
      title
    );
    return investigation;
  }

  public get(id: string): Investigation | undefined {
    return this.investigations.get(id);
  }

  public list(): Investigation[] {
    return Array.from(this.investigations.values()).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
  }

  public updateStatus(
    id: string,
    status: InvestigationStatus,
    authorId: string,
    authorName: string
  ): void {
    const inv = this.investigations.get(id);
    if (!inv) return;
    inv.status = status;
    inv.updatedAt = Date.now();
    this.addTimelineEntry(
      id,
      authorId,
      authorName,
      'changed status to',
      status
    );
  }

  // ── Evidence ────────────────────────────────────────────────────────

  public addEvidence(
    investigationId: string,
    evidence: Evidence,
    authorName: string
  ): void {
    const inv = this.investigations.get(investigationId);
    if (!inv) return;
    inv.evidence.push(evidence);
    inv.updatedAt = Date.now();
    this.addTimelineEntry(
      investigationId,
      evidence.addedBy,
      authorName,
      'added evidence',
      evidence.label
    );
  }

  public removeEvidence(investigationId: string, evidenceId: string): void {
    const inv = this.investigations.get(investigationId);
    if (!inv) return;
    inv.evidence = inv.evidence.filter((e) => e.id !== evidenceId);
    inv.updatedAt = Date.now();
  }

  // ── Action Items ────────────────────────────────────────────────────

  public addActionItem(investigationId: string, item: ActionItem): void {
    const inv = this.investigations.get(investigationId);
    if (!inv) return;
    inv.actionItems.push(item);
    inv.updatedAt = Date.now();
    this.addTimelineEntry(
      investigationId,
      item.ownerId,
      item.ownerName,
      'created action item',
      item.title
    );
  }

  public updateActionItemStatus(
    investigationId: string,
    itemId: string,
    status: ActionItem['status']
  ): void {
    const inv = this.investigations.get(investigationId);
    if (!inv) return;
    const item = inv.actionItems.find((a) => a.id === itemId);
    if (!item) return;
    item.status = status;
    if (status === 'done') item.completedAt = Date.now();
    inv.updatedAt = Date.now();
  }

  // ── Pinning ─────────────────────────────────────────────────────────

  public pinEntity(investigationId: string, entityId: string): void {
    const inv = this.investigations.get(investigationId);
    if (!inv) return;
    if (!inv.pinnedEntityIds.includes(entityId)) {
      inv.pinnedEntityIds.push(entityId);
      inv.updatedAt = Date.now();
    }
  }

  public unpinEntity(investigationId: string, entityId: string): void {
    const inv = this.investigations.get(investigationId);
    if (!inv) return;
    inv.pinnedEntityIds = inv.pinnedEntityIds.filter((id) => id !== entityId);
    inv.updatedAt = Date.now();
  }

  // ── Timeline ────────────────────────────────────────────────────────

  private addTimelineEntry(
    investigationId: string,
    authorId: string,
    authorName: string,
    action: string,
    details: string
  ): void {
    const inv = this.investigations.get(investigationId);
    if (!inv) return;
    inv.timeline.push({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      authorId,
      authorName,
      action,
      details,
    });
  }
}
