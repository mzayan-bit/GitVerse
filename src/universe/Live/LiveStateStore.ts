import { create } from 'zustand';

interface LiveMetricState {
  cpuUsage: number; // 0-100
  memoryUsage: number; // 0-100
  latencyMs: number;
  errorRate: number; // 0-100
  isDeploying: boolean;
  status: 'healthy' | 'degraded' | 'failing';
  lastUpdated: number;
}

interface LiveUniverseState {
  entityMetrics: Record<string, LiveMetricState>;

  // Actions
  updateMetric: (entityId: string, metric: Partial<LiveMetricState>) => void;
  getMetric: (entityId: string) => LiveMetricState | undefined;
}

const DEFAULT_METRIC: LiveMetricState = {
  cpuUsage: 0,
  memoryUsage: 0,
  latencyMs: 0,
  errorRate: 0,
  isDeploying: false,
  status: 'healthy',
  lastUpdated: Date.now(),
};

export const useLiveState = create<LiveUniverseState>((set, get) => ({
  entityMetrics: {},

  updateMetric: (entityId, metric) => {
    set((state) => {
      const current = state.entityMetrics[entityId] || { ...DEFAULT_METRIC };
      return {
        entityMetrics: {
          ...state.entityMetrics,
          [entityId]: {
            ...current,
            ...metric,
            lastUpdated: Date.now(),
          },
        },
      };
    });
  },

  getMetric: (entityId) => {
    return get().entityMetrics[entityId];
  },
}));
