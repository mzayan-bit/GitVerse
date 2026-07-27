import { useEffect } from 'react';
import { useMotionConfig } from '@/engine/motion/MotionConfig';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const { reducedMotion, globalSpeed } = useMotionConfig();

  useEffect(() => {
    const root = document.documentElement;
    if (reducedMotion) {
      root.style.setProperty('--motion-duration', '0ms');
      root.style.setProperty('--motion-ease', 'linear');
      root.classList.add('reduce-motion');
    } else {
      const baseDurationMs = Math.round(250 / globalSpeed);
      root.style.setProperty('--motion-duration', `${baseDurationMs}ms`);
      root.style.setProperty('--motion-ease', 'cubic-bezier(0.16, 1, 0.3, 1)');
      root.classList.remove('reduce-motion');
    }
  }, [reducedMotion, globalSpeed]);

  return <>{children}</>;
}
