import { create } from 'zustand';
import { BaseEntity } from './EntityTypes';

interface EntityState {
  entities: Record<string, BaseEntity>;
  focusedEntityId: string | null;

  // Actions
  registerEntity: (entity: BaseEntity) => void;
  updateEntity: (
    id: string,
    updates: Partial<BaseEntity> | { position: [number, number, number] }
  ) => void;
  removeEntity: (id: string) => void;
  setFocusedEntity: (id: string | null) => void;
  clearEntities: () => void;
}

export const useEntityManager = create<EntityState>((set) => ({
  entities: {},
  focusedEntityId: null,

  registerEntity: (entity) =>
    set((state) => ({
      entities: { ...state.entities, [entity.id]: entity },
    })),

  updateEntity: (id, updates) =>
    set((state) => {
      const entity = state.entities[id];
      if (!entity) return state;

      // If passing just position, map it to transform
      let actualUpdates = updates as Partial<BaseEntity>;
      if ('position' in updates && !('transform' in updates)) {
        actualUpdates = {
          transform: {
            ...entity.transform,
            position: updates.position as [number, number, number],
          },
        };
      } else if ('transform' in updates) {
        actualUpdates = {
          transform: { ...entity.transform, ...(updates.transform || {}) },
        };
      }

      return {
        entities: {
          ...state.entities,
          [id]: { ...entity, ...actualUpdates },
        },
      };
    }),

  removeEntity: (id) =>
    set((state) => {
      const newEntities = { ...state.entities };
      delete newEntities[id];
      return { entities: newEntities };
    }),

  setFocusedEntity: (id) => set({ focusedEntityId: id }),

  clearEntities: () => set({ entities: {}, focusedEntityId: null }),
}));
