import { AnimationQueue } from './AnimationQueue';
import { TransitionManager } from './TransitionManager';
import { AnimationManager } from './AnimationManager';
import { useMotionConfig } from './MotionConfig';

export class MotionEngine {
  private static instance: MotionEngine | null = null;

  public queue = new AnimationQueue();
  public transitions = new TransitionManager();
  public animations = new AnimationManager();

  public static getInstance(): MotionEngine {
    if (!MotionEngine.instance) {
      MotionEngine.instance = new MotionEngine();
    }
    return MotionEngine.instance;
  }

  public update(delta: number): void {
    const { reducedMotion, globalSpeed } = useMotionConfig.getState();

    // If global speed is 0 or reduced motion is true, snap immediately
    const effectiveDelta = reducedMotion ? 1.0 : delta * globalSpeed;

    this.queue.update(effectiveDelta);
    this.animations.update(effectiveDelta);
  }
}
