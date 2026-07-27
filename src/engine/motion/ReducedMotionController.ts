import { useMotionConfig } from './MotionConfig';

export class ReducedMotionController {
  /**
   * Listens to system-level prefers-reduced-motion media query changes.
   */
  public static initAccessibilityListener(): () => void {
    if (typeof window === 'undefined') return () => {};

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => {
      useMotionConfig.getState().setReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      }
    };
  }

  /**
   * Returns true if heavy particle effects or spring oscillations should be skipped.
   */
  public static shouldDisableComplexMotion(): boolean {
    const { reducedMotion, qualityPreset } = useMotionConfig.getState();
    return reducedMotion || qualityPreset === 'low';
  }
}
