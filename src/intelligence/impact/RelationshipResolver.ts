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
      case 'DEPENDS_ON':
        // If A DEPENDS_ON B: A is downstream from B.
        // So B's changes flow UPSTREAM -> DOWNSTREAM into A.
        return 'DOWNSTREAM';

      case 'DEPENDED_ON_BY':
        return 'UPSTREAM';

      case 'AUTHOR_OF':
      case 'CONTRIBUTES_TO':
        return 'BIDIRECTIONAL';

      case 'SIMILAR_TO':
      case 'FORK_OF':
        // Soft impact, mostly bidirectional or non-breaking
        return 'BIDIRECTIONAL';

      default:
        return 'DOWNSTREAM';
    }
  }

  public getWeight(type: RelationshipType): number {
    switch (type) {
      case 'DEPENDS_ON':
        return 1.0; // Direct hard dependency
      case 'DEPENDED_ON_BY':
        return 1.0;
      case 'AUTHOR_OF':
        return 0.8;
      case 'CONTRIBUTES_TO':
        return 0.5;
      case 'FORK_OF':
        return 0.3;
      case 'SIMILAR_TO':
        return 0.1;
      default:
        return 0.5;
    }
  }
}
