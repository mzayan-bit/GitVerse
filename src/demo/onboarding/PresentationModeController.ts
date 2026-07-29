import { MovementController } from '@/engine/navigation/MovementController';
import * as THREE from 'three';

export interface PresentationBookmark {
  id: string;
  name: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  narrative: string;
}

export class PresentationModeController {
  private static instance: PresentationModeController | null = null;

  private isPresenting = false;
  private isAutoPlaying = false;
  private currentBookmarkIndex = 0;
  private timerSeconds = 0;
  private intervalId: NodeJS.Timeout | null = null;

  public bookmarks: PresentationBookmark[] = [
    {
      id: 'scene-overview',
      name: '1. Galactic Overview',
      cameraPos: [0, 800, 1500],
      targetPos: [0, 0, 0],
      narrative:
        'Welcome to the 3D Engineering Galaxy. Here, microservice architectures form spiral solar systems.',
    },
    {
      id: 'scene-core',
      name: '2. Core Service Cluster',
      cameraPos: [200, 120, 300],
      targetPos: [0, 0, 0],
      narrative:
        'Zooming into the Core API Gateway. Notice the atmosphere glowing cyan indicating 99.4% health score.',
    },
    {
      id: 'scene-graph',
      name: '3. Knowledge Graph Mesh',
      cameraPos: [-300, 250, 450],
      targetPos: [0, 0, 0],
      narrative:
        'Knowledge graph dependency links glowing brightly across team boundaries.',
    },
  ];

  public static getInstance(): PresentationModeController {
    if (!PresentationModeController.instance) {
      PresentationModeController.instance = new PresentationModeController();
    }
    return PresentationModeController.instance;
  }

  public startPresentation(): void {
    this.isPresenting = true;
    this.timerSeconds = 0;
    if (!this.intervalId) {
      this.intervalId = setInterval(() => {
        this.timerSeconds++;
      }, 1000);
    }
    this.jumpToBookmark(0);
  }

  public stopPresentation(): void {
    this.isPresenting = false;
    this.isAutoPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  public jumpToBookmark(index: number): void {
    if (index < 0 || index >= this.bookmarks.length) return;
    this.currentBookmarkIndex = index;
    const bm = this.bookmarks[index];

    MovementController.getInstance().flyToTarget({
      entityPosition: new THREE.Vector3(...bm.targetPos),
      paddingFactor: 2.0,
    });
  }

  public nextScene(): void {
    const nextIdx = (this.currentBookmarkIndex + 1) % this.bookmarks.length;
    this.jumpToBookmark(nextIdx);
  }

  public prevScene(): void {
    const prevIdx =
      (this.currentBookmarkIndex - 1 + this.bookmarks.length) %
      this.bookmarks.length;
    this.jumpToBookmark(prevIdx);
  }

  public toggleAutoPlay(): void {
    this.isAutoPlaying = !this.isAutoPlaying;
  }

  public getIsPresenting(): boolean {
    return this.isPresenting;
  }

  public getCurrentBookmark(): PresentationBookmark {
    return this.bookmarks[this.currentBookmarkIndex];
  }

  public getTimerFormatted(): string {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
}
