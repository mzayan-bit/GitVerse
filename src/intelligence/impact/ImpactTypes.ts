import { GraphNode } from '../KnowledgeGraph/GraphNode';
import { RelationshipType } from '../KnowledgeGraph/RelationshipTypes';

// ============================================================================
// Core Domain Types for Engineering Impact Engine
// ============================================================================

export type SimulationScenarioType =
  | 'REPOSITORY_DELETED'
  | 'VERSION_UPGRADE'
  | 'API_MODIFICATION'
  | 'DEPENDENCY_REMOVED'
  | 'CONTRIBUTOR_LOSS'
  | 'REPOSITORY_ARCHIVED'
  | 'SERVICE_MIGRATION';

export interface SimulationScenario {
  id: string;
  type: SimulationScenarioType;
  targetId: string; // The ID of the repository/contributor/dependency being affected
  parameters?: Record<string, unknown>;
}

export interface SimulationContext {
  id: string;
  name: string;
  scenarios: SimulationScenario[];
  createdAt: number;
}

export interface RiskScores {
  repositoryRisk: number;
  dependencyRisk: number;
  releaseRisk: number;
  breakingChangeRisk: number;
  busFactor: number;
  ownershipRisk: number;
  criticalityScore: number;
  blastRadius: number;

  // Textual explanations of HOW the score was calculated
  explanations: Record<keyof Omit<RiskScores, 'explanations'>, string[]>;
}

export interface RiskNode {
  graphNode: GraphNode;
  riskScores: RiskScores;

  // Tracking impact paths
  isDirectlyImpacted: boolean;
  indirectImpactScore: number; // 0-100 indicating likelihood of failure downstream
}

export interface ImpactPathEdge {
  sourceId: string;
  targetId: string;
  relationshipType: RelationshipType | string;
  weight: number;
}

export interface ImpactPath {
  nodes: string[];
  edges: ImpactPathEdge[];
  cumulativeRisk: number;
}

export interface ImpactReport {
  contextId: string;
  affectedRepositories: string[]; // List of IDs
  affectedContributors: string[]; // List of usernames
  criticalPaths: ImpactPath[];
  globalRiskDelta: number; // e.g. +15% overall system risk
  summary: string;
}

export interface RelationshipResolver {
  resolveDirection(
    type: RelationshipType
  ): 'UPSTREAM' | 'DOWNSTREAM' | 'BIDIRECTIONAL';
  getWeight(type: RelationshipType): number;
}
