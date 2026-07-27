import { EasingLibrary } from './EasingLibrary';

export interface Keyframe<T> {
  time: number; // 0.0 to 1.0
  value: T;
  easing?: (t: number) => number;
}

export class TimelineTrack<T extends number | number[]> {
  constructor(
    public name: string,
    public keyframes: Keyframe<T>[]
  ) {
    this.keyframes.sort((a, b) => a.time - b.time);
  }

  public getValueAt(progress: number): T {
    if (this.keyframes.length === 0) return 0 as T;
    if (progress <= this.keyframes[0].time) return this.keyframes[0].value;
    if (progress >= this.keyframes[this.keyframes.length - 1].time) {
      return this.keyframes[this.keyframes.length - 1].value;
    }

    for (let i = 0; i < this.keyframes.length - 1; i++) {
      const k1 = this.keyframes[i];
      const k2 = this.keyframes[i + 1];

      if (progress >= k1.time && progress <= k2.time) {
        const segProgress = (progress - k1.time) / (k2.time - k1.time);
        const easeFn = k2.easing || EasingLibrary.easeInOutCubic;
        const easedProgress = easeFn(segProgress);

        if (typeof k1.value === 'number' && typeof k2.value === 'number') {
          return (k1.value + (k2.value - k1.value) * easedProgress) as T;
        }
      }
    }

    return this.keyframes[0].value;
  }
}
