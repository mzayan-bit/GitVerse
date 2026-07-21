import { RelationshipType } from '../KnowledgeGraph/RelationshipTypes';
import { RelationshipResolver as IRelationshipResolver } from './ImpactTypes';

// ============================================================================
// Relationship Resolver
// Maps KnowledgeGraph edges into directed impact vectors.
// ============================================================================

export class RelationshipResolver implements IRelationshipResolver {
  public resolveDirection(
    type: RelationshipType
  ): 'UPSTREAM' | 'DOWNSTREAM' | 'BIDIRECTIONAL' {
    switch (type) {
      case RelationshipType.DEPENDENCY:
        // A DEPENDENCY means the source node depends on the target node.
        // Therefore, the target node is UPSTREAM from the source node.
        return 'UPSTREAM';
      case RelationshipType.SHARED_CONTRIBUTOR:
      case RelationshipType.SHARED_LANGUAGE:
      case RelationshipType.SHARED_TOPIC:
      case RelationshipType.SIMILAR_ACTIVITY:
      case RelationshipType.SAME_OWNER:
        return 'BIDIRECTIONAL';
      case RelationshipType.FORK_OF:
        return 'UPSTREAM';
      default:
        return 'BIDIRECTIONAL';
    }
  }

  public getWeight(type: RelationshipType): number {
    switch (type) {
      case RelationshipType.DEPENDENCY:
        return 1.0;
      case RelationshipType.FORK_OF:
        return 0.9;
      case RelationshipType.SHARED_CONTRIBUTOR:
        return 0.5;
      case RelationshipType.SAME_OWNER:
        return 0.4;
      case RelationshipType.SIMILAR_ACTIVITY:
      case RelationshipType.SHARED_LANGUAGE:
      case RelationshipType.SHARED_TOPIC:
        return 0.2;
      default:
        return 0.1;
    }
  }
}
