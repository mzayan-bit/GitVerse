import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { RepositoryGraph } from './KnowledgeGraph/RepositoryGraph';
import { GraphEdge } from './KnowledgeGraph/GraphEdge';
import { RelationshipType } from './KnowledgeGraph/RelationshipTypes';

export class RelationshipEngine {
  public static computeRelationships(
    graph: RepositoryGraph,
    repositories: RepositoryDomainModel[]
  ): void {
    // Basic O(N^2) comparison. Optimization step (Step 6) might improve this later if N > 10,000.
    for (let i = 0; i < repositories.length; i++) {
      for (let j = i + 1; j < repositories.length; j++) {
        const repoA = repositories[i];
        const repoB = repositories[j];

        this.detectLanguageOverlap(graph, repoA, repoB);
        this.detectTopicOverlap(graph, repoA, repoB);
        this.detectOwnerSimilarity(graph, repoA, repoB);
        // Additional relationships like DEPENDENCY or FORK can be added here if available in model
      }
    }
  }

  private static detectLanguageOverlap(
    graph: RepositoryGraph,
    repoA: RepositoryDomainModel,
    repoB: RepositoryDomainModel
  ) {
    if (
      repoA.primaryLanguage === repoB.primaryLanguage &&
      repoA.primaryLanguage !== 'Unknown'
    ) {
      const edge = new GraphEdge(
        repoA.id,
        repoB.id,
        RelationshipType.SHARED_LANGUAGE,
        {
          weight: 0.8,
          description: `Both use ${repoA.primaryLanguage} as primary language.`,
          context: { language: repoA.primaryLanguage },
        }
      );
      graph.addEdge(edge);
    }
  }

  private static detectTopicOverlap(
    graph: RepositoryGraph,
    repoA: RepositoryDomainModel,
    repoB: RepositoryDomainModel
  ) {
    const topicsA = new Set(repoA.topics);
    let overlapCount = 0;
    const sharedTopics: string[] = [];

    for (const topic of repoB.topics) {
      if (topicsA.has(topic)) {
        overlapCount++;
        sharedTopics.push(topic);
      }
    }

    if (overlapCount > 0) {
      const weight = Math.min(overlapCount * 0.3, 1.0); // 0.3 weight per shared topic
      const edge = new GraphEdge(
        repoA.id,
        repoB.id,
        RelationshipType.SHARED_TOPIC,
        {
          weight,
          description: `Shared ${overlapCount} topics.`,
          context: { sharedTopics },
        }
      );
      graph.addEdge(edge);
    }
  }

  private static detectOwnerSimilarity(
    graph: RepositoryGraph,
    repoA: RepositoryDomainModel,
    repoB: RepositoryDomainModel
  ) {
    if (repoA.owner === repoB.owner) {
      const edge = new GraphEdge(
        repoA.id,
        repoB.id,
        RelationshipType.SAME_OWNER,
        {
          weight: 1.0,
          description: `Both owned by ${repoA.owner}.`,
        }
      );
      graph.addEdge(edge);
    }
  }
}
