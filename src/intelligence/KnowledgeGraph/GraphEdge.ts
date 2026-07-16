import { RelationshipType, RelationshipMetadata } from './RelationshipTypes';

export class GraphEdge {
  public sourceId: string;
  public targetId: string;
  public type: RelationshipType;
  public metadata: RelationshipMetadata;

  constructor(
    sourceId: string,
    targetId: string,
    type: RelationshipType,
    metadata: RelationshipMetadata
  ) {
    this.sourceId = sourceId;
    this.targetId = targetId;
    this.type = type;
    this.metadata = metadata;
  }
}
