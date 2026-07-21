// ============================================================================
// Risk Configuration
// Centralized weights and thresholds for risk scoring without magic numbers.
// ============================================================================

export const RiskConfig = {
  // --- Repository Risk Weights ---
  COMPLEXITY_WEIGHT: 0.3,
  LACK_OF_TESTS_WEIGHT: 0.3,
  OPEN_ISSUES_WEIGHT: 0.2,
  STALE_CODE_WEIGHT: 0.2,

  // --- Dependency Risk ---
  DEPENDENCY_DEPTH_PENALTY: 0.05,
  MAX_ALLOWED_DEPENDENCIES: 50,

  // --- Bus Factor & Ownership ---
  MIN_HEALTHY_CONTRIBUTORS: 3,
  CRITICAL_AUTHOR_PERCENTAGE: 60, // If one author writes >60%, bus factor risk is high

  // --- Criticality & Blast Radius ---
  DOWNSTREAM_MULTIPLIER: 2.5, // Each downstream consumer increases criticality rapidly
  MAX_BLAST_RADIUS_NODES: 100, // Threshold for 100% blast radius
};
