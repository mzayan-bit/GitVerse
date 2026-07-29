import { OrganizationFactory, DemoOrgMeta } from './OrganizationFactory';
import { RepositoryFactory, DemoRepo } from './RepositoryFactory';
import { MetricsFactory, DemoMetrics } from './MetricsFactory';
import { ActivityTimeline, DemoActivityEvent } from './ActivityTimeline';
import { KnowledgeGraphSeeder } from './KnowledgeGraphSeeder';
import { GalaxyEngine } from '@/engine/universe/GalaxyEngine';

export class DemoManager {
  private static instance: DemoManager | null = null;

  private activeOrg: DemoOrgMeta = OrganizationFactory.DEMO_ORGS[0]; // Default: Netflix

  public static getInstance(): DemoManager {
    if (!DemoManager.instance) {
      DemoManager.instance = new DemoManager();
    }
    return DemoManager.instance;
  }

  public getActiveOrg(): DemoOrgMeta {
    return this.activeOrg;
  }

  public switchOrg(orgId: string): void {
    const org = OrganizationFactory.getOrg(orgId);
    this.activeOrg = org;

    // Trigger procedural 3D galaxy regeneration with unique seed
    const engine = GalaxyEngine.getInstance();
    engine.generateGalaxy(org.seed);
  }

  public getActiveOrgRepos(): DemoRepo[] {
    return RepositoryFactory.generateReposForOrg(this.activeOrg.id);
  }

  public getActiveOrgMetrics(): DemoMetrics {
    return MetricsFactory.getMetricsForOrg(this.activeOrg.id);
  }

  public getActiveOrgTimeline(): DemoActivityEvent[] {
    return ActivityTimeline.getTimeline(this.activeOrg.id);
  }

  public getActiveOrgGraph() {
    return KnowledgeGraphSeeder.seedGraphForOrg(this.activeOrg.id);
  }
}
