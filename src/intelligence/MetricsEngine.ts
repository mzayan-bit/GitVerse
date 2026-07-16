import { RepositoryDomainModel } from '@/domain/RepositoryModels';

export interface RepositoryMetrics {
  healthScore: number;
  activityScore: number;
  maintenanceScore: number;
  complexityScore: number;
  popularityScore: number;
  riskScore: number;
  innovationScore: number;
  technologyDiversity: number;
}

export class MetricsEngine {
  public static computeMetrics(repo: RepositoryDomainModel): RepositoryMetrics {
    const activityScore = this.calculateActivity(repo);
    const maintenanceScore = this.calculateMaintenance(repo);
    const complexityScore = this.calculateComplexity(repo);
    const popularityScore = this.calculatePopularity(repo);
    const technologyDiversity = this.calculateDiversity(repo);

    // Risk is inversely proportional to maintenance and activity, and directly to complexity
    const riskScore = Math.max(
      0,
      Math.min(
        100,
        complexityScore - maintenanceScore - activityScore * 0.5 + 50
      )
    );

    // Innovation loosely based on modern topics and low risk
    const innovationScore = Math.max(
      0,
      Math.min(100, repo.topics.length * 10 + (100 - riskScore) * 0.5)
    );

    // Health is an aggregate
    const healthScore = Math.max(
      0,
      Math.min(100, (activityScore + maintenanceScore + popularityScore) / 3)
    );

    return {
      healthScore,
      activityScore,
      maintenanceScore,
      complexityScore,
      popularityScore,
      riskScore,
      innovationScore,
      technologyDiversity,
    };
  }

  private static calculateActivity(repo: RepositoryDomainModel): number {
    // Basic heuristic: commits, recent updates
    let score = 0;
    const now = new Date().getTime();
    const updated = new Date(repo.updatedAt).getTime();
    const daysSinceUpdate = (now - updated) / (1000 * 3600 * 24);

    if (daysSinceUpdate < 7) score += 50;
    else if (daysSinceUpdate < 30) score += 30;
    else if (daysSinceUpdate < 90) score += 10;

    // Add commit volume to activity
    score += Math.min(50, repo.commits / 10);
    return Math.min(100, score);
  }

  private static calculateMaintenance(repo: RepositoryDomainModel): number {
    if (repo.isArchived) return 0;
    let score = 50;

    // Having issues might mean it's being maintained, but too many open issues without PRs might be bad.
    // For now, simple heuristic:
    if (repo.issues > 0) score += 10;

    // Active recent updates
    const daysSinceUpdate =
      (new Date().getTime() - new Date(repo.updatedAt).getTime()) /
      (1000 * 3600 * 24);
    if (daysSinceUpdate < 30) score += 40;

    return Math.min(100, score);
  }

  private static calculateComplexity(repo: RepositoryDomainModel): number {
    // Languages count, size
    const langComplexity = Math.min(50, repo.languages.length * 10);
    const sizeComplexity = Math.min(50, repo.commits / 100);
    return langComplexity + sizeComplexity;
  }

  private static calculatePopularity(repo: RepositoryDomainModel): number {
    return Math.min(100, repo.stars * 2 + repo.forks * 5);
  }

  private static calculateDiversity(repo: RepositoryDomainModel): number {
    return Math.min(100, repo.techStack.length * 15);
  }
}
