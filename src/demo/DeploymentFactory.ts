export interface DemoDeployment {
  id: string;
  repoId: string;
  version: string;
  environment: 'production' | 'staging' | 'canary';
  status: 'SUCCESS' | 'DEPLOYING' | 'FAILED';
  deployedAt: string;
}

export class DeploymentFactory {
  public static getDeploymentsForOrg(orgId: string): DemoDeployment[] {
    return [
      {
        id: `${orgId}-dep-1`,
        repoId: `${orgId}-zuul`,
        version: 'v2.14.0',
        environment: 'production',
        status: 'SUCCESS',
        deployedAt: '5m ago',
      },
      {
        id: `${orgId}-dep-2`,
        repoId: `${orgId}-eureka`,
        version: 'v1.8.2',
        environment: 'canary',
        status: 'DEPLOYING',
        deployedAt: '1m ago',
      },
    ];
  }
}
