export class VisualReasoner {
  public static evaluateVisualClarity(nodeCount: number): {
    densityLevel: 'LOW' | 'OPTIMAL' | 'HIGH';
    recommendedCameraDistance: number;
  } {
    if (nodeCount > 50) {
      return { densityLevel: 'HIGH', recommendedCameraDistance: 2500 };
    }
    if (nodeCount > 15) {
      return { densityLevel: 'OPTIMAL', recommendedCameraDistance: 1200 };
    }
    return { densityLevel: 'LOW', recommendedCameraDistance: 600 };
  }
}
