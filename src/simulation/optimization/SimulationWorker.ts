// Web Worker for running heavy simulation graph traversals off the main thread.
// Used by PredictionEngine for parallel execution on large topologies.

self.onmessage = (e: MessageEvent) => {
  const { scenario, graphData: _graphData } = e.data;

  // Perform heavy BFS/DFS calculations here without blocking the UI
  // Returning mock output

  const result = {
    affectedNodes: scenario.failures.map(
      (f: { targetId: string }) => f.targetId
    ),
    criticalPathImpacted: true,
    expectedDowntimeMs: 3600000,
    confidenceScore: 0.95,
  };

  self.postMessage({ type: 'SIMULATION_COMPLETE', result });
};

export type {};
