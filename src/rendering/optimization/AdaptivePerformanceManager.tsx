import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRendererManager, QualityPreset } from '../core/RendererManager';

/**
 * AdaptivePerformanceManager — Monitors framerate and automatically scales down
 * rendering quality if the device cannot maintain a smooth framerate.
 */
export function AdaptivePerformanceManager() {
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const fpsHistory = useRef<number[]>([]);

  const { qualityPreset, setQualityPreset } = useRendererManager();

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    if (lastTime.current === 0) lastTime.current = now;

    // Check FPS every second
    if (now - lastTime.current >= 1000) {
      const fps = frameCount.current;
      fpsHistory.current.push(fps);

      // Keep only last 5 seconds of history
      if (fpsHistory.current.length > 5) {
        fpsHistory.current.shift();
      }

      // Calculate average FPS over the window
      const avgFps =
        fpsHistory.current.reduce((a, b) => a + b, 0) /
        fpsHistory.current.length;

      // If average FPS is too low, downgrade the quality preset
      if (fpsHistory.current.length >= 3 && avgFps < 30) {
        const presets: QualityPreset[] = ['ultra', 'high', 'medium', 'low'];
        const currentIndex = presets.indexOf(qualityPreset);

        if (currentIndex < presets.length - 1) {
          const nextPreset = presets[currentIndex + 1];
          console.warn(
            `[Performance] FPS dropped to ${avgFps.toFixed(1)}. Downgrading quality to ${nextPreset}.`
          );
          setQualityPreset(nextPreset);
          // Clear history after a downgrade to give it time to recover
          fpsHistory.current = [];
        }
      }

      // Reset counters
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return null;
}
