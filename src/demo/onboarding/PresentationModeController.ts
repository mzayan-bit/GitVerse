import { MovementController } from '@/engine/navigation/MovementController';
import { WorkspaceModeController } from '@/workspace/WorkspaceModeController';
import * as THREE from 'three';

export interface PresentationBookmark {
  id: string;
  name: string;
  cameraPos: [number, number, number];
  targetPos: [number, number, number];
  mode: 'EXPLORE' | 'ANALYZE' | 'AI' | 'PRESENTATION' | 'DEV';
  narrative: string;
}

export class PresentationModeController {
  private static instance: PresentationModeController | null = null;

  private isPresenting = false;
  private isAutoPlaying = false;
  private currentBookmarkIndex = 0;
  private timerSeconds = 0;
  private intervalId: NodeJS.Timeout | null = null;
  private autoAdvanceId: NodeJS.Timeout | null = null;

  public bookmarks: PresentationBookmark[] = [
    {
      id: 'scene-galaxy',
      name: '1. Galactic Engineering Universe',
      cameraPos: [0, 900, 1600],
      targetPos: [0, 0, 0],
      mode: 'EXPLORE',
      narrative:
        'Welcome to GitVerse. Microservices and software repositories mapped into a living 3D galaxy.',
    },
    {
      id: 'scene-core-cluster',
      name: '2. Microservice Star Constellation',
      cameraPos: [150, 100, 250],
      targetPos: [0, 0, 0],
      mode: 'EXPLORE',
      narrative:
        'Zooming into core services. Visual atmosphere indicates real-time operational health and telemetry.',
    },
    {
      id: 'scene-knowledge-graph',
      name: '3. Architecture Knowledge Mesh',
      cameraPos: [-250, 200, 400],
      targetPos: [0, 0, 0],
      mode: 'ANALYZE',
      narrative:
        'Knowledge graph mesh tracing cross-service dependencies, impact propagation, and risk scores.',
    },
    {
      id: 'scene-spatial-ai',
      name: '4. Spatial AI Copilot Engine',
      cameraPos: [100, 300, 500],
      targetPos: [0, 0, 0],
      mode: 'AI',
      narrative:
        'Natural language Spatial AI reasoning over circular dependencies, bottlenecks, and security posture.',
    },
    {
      id: 'scene-telemetry',
      name: '5. Production Dev & Operations',
      cameraPos: [0, 450, 700],
      targetPos: [0, 0, 0],
      mode: 'DEV',
      narrative:
        'Real-time CI/CD deployment pipelines, build telemetry, and live observability metrics.',
    },
    {
      id: 'scene-conclusion',
      name: '6. Live Enterprise Platform GA',
      cameraPos: [0, 600, 1100],
      targetPos: [0, 0, 0],
      mode: 'PRESENTATION',
      narrative:
        'GitVerse transforms complex engineering systems into intuitive, interactive spatial software intelligence.',
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
    this.isAutoPlaying = true;
    this.timerSeconds = 0;

    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.timerSeconds++;
    }, 1000);

    this.jumpToBookmark(0);
    this.scheduleNextAutoAdvance();
  }

  public stopPresentation(): void {
    this.isPresenting = false;
    this.isAutoPlaying = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.autoAdvanceId) {
      clearTimeout(this.autoAdvanceId);
      this.autoAdvanceId = null;
    }
  }

  public jumpToBookmark(index: number): void {
    if (index < 0 || index >= this.bookmarks.length) return;
    this.currentBookmarkIndex = index;
    const bm = this.bookmarks[index];

    // Switch workspace mode
    WorkspaceModeController.getInstance().setMode(bm.mode);

    // Fly camera smoothly
    MovementController.getInstance().flyToTarget({
      entityPosition: new THREE.Vector3(...bm.targetPos),
      paddingFactor: 2.0,
    });

    if (this.isAutoPlaying) {
      this.scheduleNextAutoAdvance();
    }
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
    if (this.isAutoPlaying) {
      this.scheduleNextAutoAdvance();
    } else if (this.autoAdvanceId) {
      clearTimeout(this.autoAdvanceId);
      this.autoAdvanceId = null;
    }
  }

  private scheduleNextAutoAdvance(): void {
    if (this.autoAdvanceId) clearTimeout(this.autoAdvanceId);
    this.autoAdvanceId = setTimeout(() => {
      if (this.isPresenting && this.isAutoPlaying) {
        this.nextScene();
      }
    }, 8000);
  }

  public getIsPresenting(): boolean {
    return this.isPresenting;
  }

  public getIsAutoPlaying(): boolean {
    return this.isAutoPlaying;
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
