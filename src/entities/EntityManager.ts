import { create } from 'zustand';
import { BaseEntity } from './EntityTypes';

interface EntityState {
  entities: Record<string, BaseEntity>;
  focusedEntityId: string | null;

  // Actions
  registerEntity: (entity: BaseEntity) => void;
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

  removeEntity: (id) =>
    set((state) => {
      const newEntities = { ...state.entities };
      delete newEntities[id];
      return { entities: newEntities };
    }),

  setFocusedEntity: (id) => set({ focusedEntityId: id }),

  clearEntities: () => set({ entities: {}, focusedEntityId: null }),
}));
