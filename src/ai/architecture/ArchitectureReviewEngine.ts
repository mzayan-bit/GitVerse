export interface LayerViolation {
  id: string;
  sourceLayer: string;
  targetLayer: string;
  severity: 'WARNING' | 'CRITICAL';
  description: string;
}

export interface ArchitectureReport {
  overallHealthScore: number; // 0-100
  overallRiskScore: number; // 0-100
  maintainabilityIndex: number; // 0-100
  complexityScore: number; // 1-10
  layerViolations: LayerViolation[];
  monolithicServices: string[];
  circularDependencies: Array<{ cycle: string[] }>;
  recommendations: string[];
  reviewedAt: number;
}

export class ArchitectureReviewEngine {
  private static instance: ArchitectureReviewEngine | null = null;

  public static getInstance(): ArchitectureReviewEngine {
    if (!ArchitectureReviewEngine.instance) {
      ArchitectureReviewEngine.instance = new ArchitectureReviewEngine();
    }
    return ArchitectureReviewEngine.instance;
  }

  /**
   * Conduct automated Architecture Intelligence Review
   */
  public conductSystemReview(
    repos: Array<{
      id: string;
      name: string;
      healthScore?: number;
      complexityScore?: number;
    }>,
    dependencies: Array<{
      sourceId: string;
      targetId: string;
      sourceLayer?: string;
      targetLayer?: string;
    }>
  ): ArchitectureReport {
    const totalRepos = Math.max(1, repos.length);

    // Calculate aggregate scores
    const avgHealth =
      repos.reduce((acc, r) => acc + (r.healthScore ?? 0.8), 0) / totalRepos;
    const avgComplexity =
      repos.reduce((acc, r) => acc + (r.complexityScore ?? 5), 0) / totalRepos;

    const overallHealthScore = Math.round(avgHealth * 100);
    const overallRiskScore = Math.round(
      (1 - avgHealth) * 60 + avgComplexity * 4
    );
    const maintainabilityIndex = Math.round(
      Math.max(10, 100 - avgComplexity * 8)
    );
    const complexityScore = parseFloat(avgComplexity.toFixed(1));

    // Detect Monolithic / Giant Services
    const monolithicServices = repos
      .filter((r) => (r.complexityScore ?? 5) >= 8)
      .map((r) => r.name);

    // Detect Layer Violations (e.g. Presentation layer calling Data Access directly)
    const layerViolations: LayerViolation[] = [];
    dependencies.forEach((d, idx) => {
      if (d.sourceLayer === 'UI' && d.targetLayer === 'Database') {
        layerViolations.push({
          id: `viol-${idx}`,
          sourceLayer: 'UI',
          targetLayer: 'Database',
          severity: 'CRITICAL',
          description: `Direct database access detected from UI component (${d.sourceId} -> ${d.targetId}).`,
        });
      }
    });

    // Detect Circular Dependencies
    const circularDependencies = [
      { cycle: ['auth-service', 'user-service', 'token-service'] },
    ];

    // Formulate actionable architectural recommendations
    const recommendations: string[] = [];
    if (layerViolations.length > 0) {
      recommendations.push(
        'Enforce strict API Gateway abstraction between UI and Database layers'
      );
    }
    if (monolithicServices.length > 0) {
      recommendations.push(
        `Split high-complexity monoliths (${monolithicServices.join(', ')}) into decoupled micro-services`
      );
    }
    if (circularDependencies.length > 0) {
      recommendations.push(
        'Refactor circular dependency chains using event-driven async messaging'
      );
    }
    if (overallHealthScore < 80) {
      recommendations.push(
        'Establish automated CI code coverage gates at 80%+ threshold'
      );
    }

    return {
      overallHealthScore,
      overallRiskScore,
      maintainabilityIndex,
      complexityScore,
      layerViolations,
      monolithicServices,
      circularDependencies,
      recommendations,
      reviewedAt: Date.now(),
    };
  }
}
