export class WindowManager {
  /**
   * Clamps floating window coordinates inside screen bounds.
   */
  static clampWindowBounds(
    bounds: { x: number; y: number; w: number; h: number },
    screenWidth: number,
    screenHeight: number
  ): { x: number; y: number; w: number; h: number } {
    const minW = 220;
    const minH = 150;

    const w = Math.max(minW, Math.min(bounds.w, screenWidth - 40));
    const h = Math.max(minH, Math.min(bounds.h, screenHeight - 80));

    const x = Math.max(10, Math.min(bounds.x, screenWidth - w - 10));
    const y = Math.max(40, Math.min(bounds.y, screenHeight - h - 10));

    return { x, y, w, h };
  }
}
