import { SpringPhysics, SpringState } from './SpringPhysics';
import { SPRING_PRESETS, SpringConfig } from './MotionConfig';

export class TransitionManager {
  private states: Map<string, SpringState> = new Map();

  public register(id: string, initialValue: number): void {
    this.states.set(id, {
      current: initialValue,
      target: initialValue,
      velocity: 0,
    });
  }

  public setTarget(id: string, targetValue: number): void {
    const state = this.states.get(id);
    if (state) {
      state.target = targetValue;
    } else {
      this.states.set(id, {
        current: targetValue,
        target: targetValue,
        velocity: 0,
      });
    }
  }

  public update(
    id: string,
    delta: number,
    preset: SpringConfig = SPRING_PRESETS.snappy
  ): { value: number; isAtRest: boolean } {
    const state = this.states.get(id);
    if (!state) return { value: 0, isAtRest: true };

    const result = SpringPhysics.step(state, preset, delta);
    state.current = result.current;
    state.velocity = result.velocity;

    return { value: result.current, isAtRest: result.isAtRest };
  }

  public getValue(id: string): number {
    return this.states.get(id)?.current ?? 0;
  }
}
