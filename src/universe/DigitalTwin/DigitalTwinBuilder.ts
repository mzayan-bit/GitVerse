import { UniverseHierarchy } from '../UniverseState';
import {
  ClusterModel,
  ServiceModel,
  DatabaseModel,
  DeploymentModel,
  PipelineModel,
} from '@/domain/Infrastructure';
import { useEntityManager } from '@/entities/EntityManager';
import { EntityFactory } from '@/entities/EntityFactory';

export class DigitalTwinBuilder {
  public static augmentHierarchy(hierarchy: UniverseHierarchy): void {
    const clusters: ClusterModel[] = [];
    const services: ServiceModel[] = [];
    const databases: DatabaseModel[] = [];
    const deployments: DeploymentModel[] = [];
    const pipelines: PipelineModel[] = [];

    // Create 50 clusters for performance validation
    for (let i = 0; i < 50; i++) {
      clusters.push({
        id: 'cluster-' + i,
        providerId: 'aws-' + i,
        name: 'production-cluster-' + i,
        status: 'active',
      });
    }

    // Create services based on solar systems (languages)
    for (const sys of hierarchy.solarSystems) {
      const serviceId = 'svc-' + sys.id;
      services.push({
        id: serviceId,
        namespaceId: 'ns-1',
        name: sys.name + ' Service',
        type: 'microservice',
        status: 'running',
      });

      // Create a database for the service
      const dbId = 'db-' + sys.id;
      databases.push({
        id: dbId,
        providerId: 'aws-db',
        name: sys.name + ' DB',
        engine: 'postgres',
        version: '14',
        status: 'available',
      });

      // Link the repo (planets) to this service visually in the next step
      for (const planetId of sys.planetIds) {
        // Create a pipeline for each repo
        pipelines.push({
          id: 'pipe-' + planetId,
          repositoryId: planetId,
          name: 'CI/CD Pipeline',
          provider: 'github-actions',
          lastRunStatus: 'success',
          lastRunTime: Date.now(),
        });
      }
    }

    hierarchy.clusters = clusters;
    hierarchy.services = services;
    hierarchy.databases = databases;
    hierarchy.deployments = deployments;
    hierarchy.pipelines = pipelines;
  }

  public static computeDigitalTwinLayout(hierarchy: UniverseHierarchy): void {
    const entityManager = useEntityManager.getState();

    // Register entities
    if (hierarchy.services) {
      hierarchy.services.forEach((svc) => {
        // Position service near the solar system it belongs to
        const sysId = svc.id.replace('svc-', '');
        const sysEntity = entityManager.entities[sysId];

        const pos = sysEntity?.transform?.position || [0, 0, 0];

        // Place service directly above the solar system
        const svcPos = [pos[0], pos[1] + 150, pos[2]] as [
          number,
          number,
          number,
        ];

        EntityFactory.createEntity(svc.id, 'service', svc.name, sysId, {
          position: svcPos,
        });
      });
    }

    if (hierarchy.databases) {
      hierarchy.databases.forEach((db) => {
        const sysId = db.id.replace('db-', '');
        const sysEntity = entityManager.entities[sysId];

        const pos = sysEntity?.transform?.position || [0, 0, 0];

        // Place DB slightly below the solar system
        const dbPos = [pos[0], pos[1] - 150, pos[2]] as [
          number,
          number,
          number,
        ];

        EntityFactory.createEntity(db.id, 'database', db.name, sysId, {
          position: dbPos,
        });
      });
    }

    // Update repository (planet) orbit logic if necessary
  }
}
