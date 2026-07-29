import { DemoManager } from '../DemoManager';
import { PresentationModeController } from '../onboarding/PresentationModeController';

export class ConferenceDemoMode {
  private static instance: ConferenceDemoMode | null = null;
  private isAutoLooping = false;

  public static getInstance(): ConferenceDemoMode {
    if (!ConferenceDemoMode.instance) {
      ConferenceDemoMode.instance = new ConferenceDemoMode();
    }
    return ConferenceDemoMode.instance;
  }

  /**
   * Recruiter Quick 60s Tour: Loads Netflix org and starts Keynote presentation mode
   */
  public launchRecruiterQuickTour(): void {
    const demoMgr = DemoManager.getInstance();
    demoMgr.switchOrg('netflix');

    const presentation = PresentationModeController.getInstance();
    presentation.startPresentation();
  }

  /**
   * Investor Showcase Mode: Loads OpenAI org and switches to high-density 3D universe
   */
  public launchInvestorShowcase(): void {
    const demoMgr = DemoManager.getInstance();
    demoMgr.switchOrg('openai');

    const presentation = PresentationModeController.getInstance();
    presentation.startPresentation();
  }

  public toggleAutoLoop(): void {
    this.isAutoLooping = !this.isAutoLooping;
  }

  public getIsAutoLooping(): boolean {
    return this.isAutoLooping;
  }
}
