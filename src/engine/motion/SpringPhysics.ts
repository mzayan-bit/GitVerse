import { SpringConfig, SPRING_PRESETS } from './MotionConfig';

export interface SpringState {
  current: number;
  target: number;
  velocity: number;
}

export class SpringPhysics {
  /**
   * Solves 1D spring step using semi-implicit Euler integration.
   */
  static step(
    state: SpringState,
    config: SpringConfig = SPRING_PRESETS.snappy,
    delta: number
  ): { current: number; velocity: number; isAtRest: boolean } {
    const { stiffness, damping, mass, precision } = config;

    // Displacement from target
    const displacement = state.current - state.target;

    // Spring force (Hooke's Law: F = -k * x)
    const springForce = -stiffness * displacement;

    // Damping force (F = -c * v)
    const dampingForce = -damping * state.velocity;

    // Acceleration (a = F / m)
    const acceleration = (springForce + dampingForce) / mass;

    // Integrate velocity and current position
    const newVelocity = state.velocity + acceleration * delta;
    const newCurrent = state.current + newVelocity * delta;

    // Check rest condition
    const isAtRest =
      Math.abs(newVelocity) < precision &&
      Math.abs(newCurrent - state.target) < precision;

    return {
      current: isAtRest ? state.target : newCurrent,
      velocity: isAtRest ? 0 : newVelocity,
      isAtRest,
    };
  }
}
