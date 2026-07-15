import { BaseEntity, EntityType, EntityTransform } from './EntityTypes';
import { useEntityManager } from './EntityManager';

export class EntityFactory {
  /**
   * Generates a generic entity and registers it with the EntityManager.
   */
  public static createEntity(
    id: string,
    type: EntityType,
    name: string,
    seed: string,
    transform?: Partial<EntityTransform>,
    metadata?: Record<string, unknown>
  ): BaseEntity {
    const entity: BaseEntity = {
      id,
      type,
      name,
      seed,
      transform: {
        position: transform?.position || [0, 0, 0],
        rotation: transform?.rotation || [0, 0, 0],
        scale: transform?.scale || [1, 1, 1],
      },
      metadata,
    };

    useEntityManager.getState().registerEntity(entity);
    return entity;
  }
}
