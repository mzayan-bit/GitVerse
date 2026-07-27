import { DockPosition } from './PanelController';

export interface DropTargetZone {
  position: DockPosition;
  rect: { x: number; y: number; w: number; h: number };
}

export class DockManager {
  /**
   * Evaluates drop target zones based on pointer position relative to viewport.
   */
  static getDropZoneAtPointer(
    clientX: number,
    clientY: number,
    screenWidth: number,
    screenHeight: number
  ): DockPosition {
    const margin = 80;

    if (clientX < margin) return 'left';
    if (clientX > screenWidth - margin) return 'right';
    if (clientY > screenHeight - margin) return 'bottom';

    return 'floating';
  }
}
