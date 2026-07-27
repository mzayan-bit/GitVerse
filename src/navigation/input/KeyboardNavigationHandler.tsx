import { useEffect } from 'react';
import { MovementController } from '@/engine/navigation/MovementController';

/**
 * KeyboardNavigationHandler — Wires up the immersive MovementController engine
 * to run on RAF loop and handle continuous input, momentum, and physics.
 */
export function KeyboardNavigationHandler() {
  useEffect(() => {
    const controller = MovementController.getInstance();
    controller.init();

    let rafId: number;
    let lastTime = performance.now();

    const updateLoop = (now: number) => {
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      controller.update(delta);
      rafId = requestAnimationFrame(updateLoop);
    };

    rafId = requestAnimationFrame(updateLoop);

    return () => {
      cancelAnimationFrame(rafId);
      controller.destroy();
    };
  }, []);

  return null;
}
