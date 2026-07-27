import { useFrame } from '@react-three/fiber';
import { MotionEngine } from '../MotionEngine';

/**
 * Headless controller running MotionEngine per-frame update loop inside R3F.
 */
export function UniverseAnimationController() {
  useFrame((_, delta) => {
    MotionEngine.getInstance().update(delta);
  });

  return null;
}
