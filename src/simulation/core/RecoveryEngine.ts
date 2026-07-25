import { PredictionReport } from '../types';

export class RecoveryEngine {
  /**
   * Generates a step-by-step recovery plan based on the predicted blast radius.
   */
  public generateRecoveryPlan(report: PredictionReport): string[] {
    const steps: string[] = [];

    steps.push(
      '1. Acknowledge Incident and lock deployments to affected nodes.'
    );

    // The recovery order is critical path first, then edge dependencies
    report.recoveryOrder.forEach((nodeId, index) => {
      steps.push(`${index + 2}. Restart/Recover service: ${nodeId}`);
    });

    steps.push(
      `${steps.length + 1}. Verify health checks pass for direct blast radius.`
    );
    steps.push(`${steps.length + 2}. Unlock deployments.`);

    return steps;
  }
}
