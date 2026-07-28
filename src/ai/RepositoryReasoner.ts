export interface RepositoryAnalysisResult {
  repoId: string;
  repoName: string;
  healthScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  primaryLanguage: string;
  complexityScore: number;
  summary: string;
  recommendedActions: string[];
}

export class RepositoryReasoner {
  public static analyzeRepository(repo: {
    id: string;
    name: string;
    healthScore?: number;
    complexityScore?: number;
    language?: string;
    starCount?: number;
    branchesCount?: number;
  }): RepositoryAnalysisResult {
    const health = repo.healthScore ?? 0.85;
    const complexity = repo.complexityScore ?? 5;
    const language = repo.language || 'TypeScript';

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (health < 0.4 || complexity > 8) riskLevel = 'CRITICAL';
    else if (health < 0.65 || complexity > 6) riskLevel = 'HIGH';
    else if (health < 0.8) riskLevel = 'MEDIUM';

    const summary = `${repo.name} is a ${language} repository with a health score of ${(health * 100).toFixed(0)}% and complexity index ${complexity}/10.`;

    const recommendedActions: string[] = [];
    if (health < 0.7)
      recommendedActions.push('Increase test coverage above 80%');
    if (complexity > 7)
      recommendedActions.push(
        'Refactor large monolithic modules into micro-services'
      );
    if (riskLevel === 'HIGH' || riskLevel === 'CRITICAL')
      recommendedActions.push(
        'Audit security dependencies and update outdated packages'
      );

    return {
      repoId: repo.id,
      repoName: repo.name,
      healthScore: health,
      riskLevel,
      primaryLanguage: language,
      complexityScore: complexity,
      summary,
      recommendedActions,
    };
  }
}
