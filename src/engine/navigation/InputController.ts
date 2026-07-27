import * as THREE from 'three';

export class InputController {
  private activeKeys: Set<string> = new Set();
  private isPointerDown: boolean = false;
  private pointerDelta: THREE.Vector2 = new THREE.Vector2();
  private wheelDelta: number = 0;
  private isShiftPressed: boolean = false;
  private listenersAttached: boolean = false;

  private onKeyDownBound = this.onKeyDown.bind(this);
  private onKeyUpBound = this.onKeyUp.bind(this);
  private onPointerDownBound = this.onPointerDown.bind(this);
  private onPointerMoveBound = this.onPointerMove.bind(this);
  private onPointerUpBound = this.onPointerUp.bind(this);
  private onWheelBound = this.onWheel.bind(this);

  public attach(): void {
    if (this.listenersAttached || typeof window === 'undefined') return;

    window.addEventListener('keydown', this.onKeyDownBound);
    window.addEventListener('keyup', this.onKeyUpBound);
    window.addEventListener('pointerdown', this.onPointerDownBound);
    window.addEventListener('pointermove', this.onPointerMoveBound);
    window.addEventListener('pointerup', this.onPointerUpBound);
    window.addEventListener('wheel', this.onWheelBound, { passive: true });

    this.listenersAttached = true;
  }

  public detach(): void {
    if (!this.listenersAttached || typeof window === 'undefined') return;

    window.removeEventListener('keydown', this.onKeyDownBound);
    window.removeEventListener('keyup', this.onKeyUpBound);
    window.removeEventListener('pointerdown', this.onPointerDownBound);
    window.removeEventListener('pointermove', this.onPointerMoveBound);
    window.removeEventListener('pointerup', this.onPointerUpBound);
    window.removeEventListener('wheel', this.onWheelBound);

    this.listenersAttached = false;
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName))
      return;
    this.activeKeys.add(e.key.toLowerCase());
    if (e.shiftKey) this.isShiftPressed = true;
  }

  private onKeyUp(e: KeyboardEvent): void {
    this.activeKeys.delete(e.key.toLowerCase());
    if (!e.shiftKey) this.isShiftPressed = false;
  }

  private onPointerDown(e: PointerEvent): void {
    if ((e.target as HTMLElement)?.tagName === 'CANVAS') {
      this.isPointerDown = true;
    }
  }

  private onPointerMove(e: PointerEvent): void {
    if (this.isPointerDown) {
      this.pointerDelta.x += e.movementX;
      this.pointerDelta.y += e.movementY;
    }
  }

  private onPointerUp(): void {
    this.isPointerDown = false;
  }

  private onWheel(e: WheelEvent): void {
    this.wheelDelta += e.deltaY;
  }

  public getMovementVector(speedMultiplier: number = 1): THREE.Vector3 {
    const move = new THREE.Vector3();
    const mult = this.isShiftPressed ? speedMultiplier * 2.5 : speedMultiplier;

    if (this.activeKeys.has('w') || this.activeKeys.has('arrowup')) move.z -= 1;
    if (this.activeKeys.has('s') || this.activeKeys.has('arrowdown'))
      move.z += 1;
    if (this.activeKeys.has('a') || this.activeKeys.has('arrowleft'))
      move.x -= 1;
    if (this.activeKeys.has('d') || this.activeKeys.has('arrowright'))
      move.x += 1;
    if (this.activeKeys.has('e') || this.activeKeys.has('space')) move.y += 1;
    if (this.activeKeys.has('q')) move.y -= 1;

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(mult);
    }

    return move;
  }

  public consumePointerDelta(): THREE.Vector2 {
    const delta = this.pointerDelta.clone();
    this.pointerDelta.set(0, 0);
    return delta;
  }

  public consumeWheelDelta(): number {
    const w = this.wheelDelta;
    this.wheelDelta = 0;
    return w;
  }

  public isDragging(): boolean {
    return this.isPointerDown;
  }

  public isBoosting(): boolean {
    return this.isShiftPressed;
  }
}
