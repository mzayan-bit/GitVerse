import { RepositoryDomainModel } from '@/domain/RepositoryModels';
import { ImpactGraph } from '../ImpactGraph';
import { TraversalEngine } from '../TraversalEngine';
import { RiskConfig } from './RiskConfig';
import { RiskScores } from '../ImpactTypes';

// ============================================================================
// Risk Scoring Engine
// Calculates engineering risk metrics based on graph topology and repository metadata.
// ============================================================================

export class RiskScoringEngine {
  private traversal = new TraversalEngine();

  /**
   * Evaluates all nodes in the ImpactGraph and assigns them risk scores.
   */
  public evaluateGraphRisks(graph: ImpactGraph): void {
    graph.riskNodes.forEach((riskNode) => {
      const repo = riskNode.graphNode.repository;
      if (repo) {
        const isCore = repo.topics?.includes('core');
        const isCritical = repo.topics?.includes('critical');
        const isInfra = repo.topics?.includes('infrastructure');

        const scores = this.calculateRepositoryRisk(
          graph,
          riskNode.graphNode.id,
          repo,
          { isCore, isCritical, isInfra }
        );
        graph.updateRiskNode(riskNode.graphNode.id, { riskScores: scores });
      }
    });
  }

  private calculateRepositoryRisk(
    graph: ImpactGraph,
    nodeId: string,
    repoData: RepositoryDomainModel,
    _meta: { isCore?: boolean; isCritical?: boolean; isInfra?: boolean }
  ): RiskScores {
    const explanations: Record<string, string[]> = {
      repositoryRisk: [],
      dependencyRisk: [],
      releaseRisk: [],
      breakingChangeRisk: [],
      busFactor: [],
      ownershipRisk: [],
      criticalityScore: [],
      blastRadius: [],
    };

    // 1. Bus Factor & Ownership Risk
    let busFactorRisk = 0;
    if (repoData.contributors.length === 0) {
      busFactorRisk = 100;
      explanations.busFactor.push('No active contributors found.');
    } else if (
      repoData.contributors.length < RiskConfig.MIN_HEALTHY_CONTRIBUTORS
    ) {
      busFactorRisk = 75;
      explanations.busFactor.push(
        `Only ${repoData.contributors.length} active contributors (below healthy threshold of ${RiskConfig.MIN_HEALTHY_CONTRIBUTORS}).`
      );
    } else {
      // Check if one author dominates
      const totalCommits = repoData.contributors.reduce(
        (acc, c) => acc + c.commits,
        0
      );
      const topAuthor = [...repoData.contributors].sort(
        (a, b) => b.commits - a.commits
      )[0];

      if (topAuthor && totalCommits > 0) {
        const percentage = (topAuthor.commits / totalCommits) * 100;
        if (percentage > RiskConfig.CRITICAL_AUTHOR_PERCENTAGE) {
          busFactorRisk = 80;
          explanations.busFactor.push(
            `High reliance on single author (${topAuthor.username} wrote ${percentage.toFixed(0)}% of commits).`
          );
        } else {
          busFactorRisk = 10; // Healthy
          explanations.busFactor.push(
            'Contributions are well distributed among multiple authors.'
          );
        }
      }
    }

    const ownershipRisk = busFactorRisk; // Tied closely in this heuristic
    explanations.ownershipRisk = [...explanations.busFactor];

    // 2. Blast Radius & Criticality Score
    const downstreamPaths = this.traversal.findDownstreamImpact(graph, nodeId);

    // Count unique downstream repositories
    const uniqueDownstream = new Set<string>();
    downstreamPaths.forEach((p) =>
      p.nodes.forEach((n) => uniqueDownstream.add(n))
    );
    uniqueDownstream.delete(nodeId); // Remove self

    let blastRadius =
      (uniqueDownstream.size / RiskConfig.MAX_BLAST_RADIUS_NODES) * 100;
    blastRadius = Math.min(100, Math.max(0, blastRadius));

    if (uniqueDownstream.size > 0) {
      explanations.blastRadius.push(
        `Changes directly or indirectly affect ${uniqueDownstream.size} downstream repositories.`
      );
    } else {
      explanations.blastRadius.push(
        'No downstream repositories depend on this node.'
      );
    }

    const criticalityScore = Math.min(
      100,
      uniqueDownstream.size * RiskConfig.DOWNSTREAM_MULTIPLIER
    );
    explanations.criticalityScore.push(
      `Criticality scaled by downstream consumer count (${uniqueDownstream.size} * ${RiskConfig.DOWNSTREAM_MULTIPLIER}).`
    );

    // 3. Dependency Risk (Upstream)
    const upstreamPaths = this.traversal.findUpstreamImpact(graph, nodeId);
    const uniqueUpstream = new Set<string>();
    upstreamPaths.forEach((p) => p.nodes.forEach((n) => uniqueUpstream.add(n)));
    uniqueUpstream.delete(nodeId);

    let dependencyRisk = 0;
    if (uniqueUpstream.size > RiskConfig.MAX_ALLOWED_DEPENDENCIES) {
      dependencyRisk = 80;
      explanations.dependencyRisk.push(
        `Excessive upstream dependency chain (${uniqueUpstream.size} nodes). Increases fragility.`
      );
    } else if (uniqueUpstream.size > 0) {
      dependencyRisk =
        (uniqueUpstream.size / RiskConfig.MAX_ALLOWED_DEPENDENCIES) * 50;
      explanations.dependencyRisk.push(
        `Relies on ${uniqueUpstream.size} upstream systems.`
      );
    } else {
      explanations.dependencyRisk.push(
        'Zero upstream dependencies. Highly autonomous.'
      );
    }

    // 4. Repository & Release Risk
    // Uses the existing Health Score data mapped into a risk heuristic
    const baseHealth = repoData.healthScore?.overall || 50;
    const repositoryRisk = 100 - baseHealth; // Inverse of health
    explanations.repositoryRisk.push(
      `Derived from inverse repository health score (Health: ${baseHealth}).`
    );

    let releaseRisk = 50; // default medium
    if (repoData.releases === 0) {
      releaseRisk = 80;
      explanations.releaseRisk.push(
        'No official releases detected. Deployments may be ad-hoc.'
      );
    } else {
      releaseRisk = 20;
      explanations.releaseRisk.push(
        `Stable release cadence (${repoData.releases} total releases).`
      );
    }

    const breakingChangeRisk = criticalityScore > 50 ? 85 : 30;
    explanations.breakingChangeRisk.push(
      `Calculated based on criticality score: ${criticalityScore.toFixed(0)}`
    );

    return {
      repositoryRisk: this.clamp(repositoryRisk),
      dependencyRisk: this.clamp(dependencyRisk),
      releaseRisk: this.clamp(releaseRisk),
      breakingChangeRisk: this.clamp(breakingChangeRisk),
      busFactor: this.clamp(busFactorRisk),
      ownershipRisk: this.clamp(ownershipRisk),
      criticalityScore: this.clamp(criticalityScore),
      blastRadius: this.clamp(blastRadius),
      explanations,
    };
  }

  private clamp(val: number): number {
    return Math.round(Math.max(0, Math.min(100, val)));
  }
}
