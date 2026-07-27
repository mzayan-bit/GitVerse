import { useCameraRig, CameraMode } from '@/navigation/camera/CameraRig';
import { MOVEMENT_PRESETS, MovementPresetConfig } from './MovementPresets';
import { MovementPhysics } from './MovementPhysics';
import { VelocitySystem } from './VelocitySystem';
import { InputController } from './InputController';
import { FlightController } from './FlightController';
import { OrbitController } from './OrbitController';
import { FocusController, FocusTargetOptions } from './FocusController';

export class MovementController {
  private static instance: MovementController | null = null;

  public inputController: InputController = new InputController();
  public velocitySystem: VelocitySystem = new VelocitySystem();
  private flightController: FlightController = new FlightController();
  private orbitController: OrbitController = new OrbitController();

  public static getInstance(): MovementController {
    if (!MovementController.instance) {
      MovementController.instance = new MovementController();
    }
    return MovementController.instance;
  }

  public init(): void {
    this.inputController.attach();
  }

  public destroy(): void {
    this.inputController.detach();
  }

  /**
   * Main per-frame physics update method. Should be called inside RAF or R3F useFrame.
   */
  public update(delta: number): void {
    const store = useCameraRig.getState();
    const mode: CameraMode = store.mode;
    const preset: MovementPresetConfig =
      MOVEMENT_PRESETS[mode] || MOVEMENT_PRESETS.orbit;

    const pointerDelta = this.inputController.consumePointerDelta();
    const wheelDelta = this.inputController.consumeWheelDelta();
    const movementInput = this.inputController.getMovementVector(
      store.speedMultiplier
    );

    let nextPosition = store.position.clone();
    let nextTarget = store.target.clone();

    // Execute mode-specific movement logic
    if (mode === 'fly' || mode === 'firstPerson' || mode === 'explore') {
      const flightResult = this.flightController.updateFlight(
        store.position,
        store.target,
        movementInput,
        pointerDelta,
        preset,
        delta
      );
      nextPosition = flightResult.nextPosition;
      nextTarget = flightResult.nextTarget;
    } else if (mode === 'orbit' || mode === 'focus') {
      const orbitResult = this.orbitController.updateOrbit(
        store.position,
        store.target,
        pointerDelta,
        wheelDelta,
        preset,
        delta
      );
      nextPosition = orbitResult.nextPosition;
      nextTarget = orbitResult.nextTarget;
    }

    // Apply distance constraints and safety bounds
    nextPosition = MovementPhysics.clampDistanceSphere(
      nextPosition,
      nextTarget,
      preset.minDistance,
      preset.maxDistance
    );

    // Apply smooth exponential interpolation to store goal state
    const smoothedPosition = MovementPhysics.smoothStepVector(
      store.position,
      nextPosition,
      preset.damping,
      delta
    );

    const smoothedTarget = MovementPhysics.smoothStepVector(
      store.target,
      nextTarget,
      preset.damping,
      delta
    );

    // Update global CameraRig store
    useCameraRig.setState({
      position: smoothedPosition,
      target: smoothedTarget,
      goalPosition: nextPosition,
      goalTarget: nextTarget,
    });
  }

  /**
   * Initiates a smooth framed focus transition to a given target position.
   */
  public flyToTarget(options: FocusTargetOptions): void {
    const { goalPosition, goalTarget } =
      FocusController.calculateFramedTarget(options);
    useCameraRig.getState().setGoal(goalPosition, goalTarget);
  }
}
