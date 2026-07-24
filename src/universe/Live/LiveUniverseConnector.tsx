import { useEffect } from 'react';
import { EventBus } from '@/observability/core/EventBus';
import { LiveEvent } from '@/observability/types';
import { useLiveState } from './LiveStateStore';

/**
 * A headless React component that bridges the standard Observability EventBus
 * into the highly-optimized Zustand LiveStateStore for the WebGL Universe.
 */
export function LiveUniverseConnector() {
  const updateMetric = useLiveState((s) => s.updateMetric);

  useEffect(() => {
    const handleEvent = (event: LiveEvent) => {
      // 1. Map Metrics
      if (event.type === 'metric') {
        if (event.metricName.includes('cpu')) {
          updateMetric(event.sourceId, { cpuUsage: event.value });
        } else if (event.metricName.includes('memory')) {
          updateMetric(event.sourceId, { memoryUsage: event.value });
        }
      }

      // 2. Map Incidents to degraded state
      if (event.type === 'incident') {
        updateMetric(event.sourceId, {
          status: event.severity === 'critical' ? 'failing' : 'degraded',
        });
      }

      // 3. Map Deployments
      if (event.type === 'deployment') {
        updateMetric(event.sourceId, {
          isDeploying: event.status === 'running' || event.status === 'pending',
        });
      }
    };

    // Subscribe to all incoming events
    const unsubscribe = EventBus.getInstance().subscribeAll(handleEvent);

    return () => {
      unsubscribe();
    };
  }, [updateMetric]);

  return null;
}
