export type OnboardingStep =
  | 'WELCOME'
  | 'GALAXY_EXPLORER'
  | 'INSPECTOR'
  | 'KNOWLEDGE_GRAPH'
  | 'COPILOT'
  | 'COMPLETED';

export interface StepInfo {
  step: OnboardingStep;
  title: string;
  description: string;
  targetElementId?: string;
  panelToOpen?: string;
}

export class OnboardingController {
  private static instance: OnboardingController | null = null;
  private currentStep: OnboardingStep = 'WELCOME';
  private isActive = true;

  public static STEPS: StepInfo[] = [
    {
      step: 'WELCOME',
      title: 'Welcome to GitVerse 3D',
      description:
        'Explore software engineering architectures as living, infinite procedural 3D cosmoses.',
    },
    {
      step: 'GALAXY_EXPLORER',
      title: 'Procedural 3D Galaxy Engine',
      description:
        'Organizations generate logarithmic spiral arm galaxies where repos are planets and teams are star systems.',
      targetElementId: 'btn-cosmos-panel',
    },
    {
      step: 'INSPECTOR',
      title: 'Universe & Repository Inspector',
      description:
        'Inspect repository health scores, language distributions, and commit timelines in real time.',
      targetElementId: 'btn-inspector-panel',
      panelToOpen: 'inspector',
    },
    {
      step: 'KNOWLEDGE_GRAPH',
      title: 'Knowledge Graph Visualization',
      description:
        'Trace distributed micro-service dependencies and circular dependency loops with ease.',
      targetElementId: 'btn-graph-panel',
      panelToOpen: 'graph',
    },
    {
      step: 'COPILOT',
      title: 'Spatial AI Copilot',
      description:
        'Ask AI natural language questions: "Take me to auth", "Why is production slow?", or use Voice Commands.',
      targetElementId: 'btn-ai-panel',
      panelToOpen: 'ai',
    },
  ];

  public static getInstance(): OnboardingController {
    if (!OnboardingController.instance) {
      OnboardingController.instance = new OnboardingController();
    }
    return OnboardingController.instance;
  }

  public getCurrentStep(): OnboardingStep {
    return this.currentStep;
  }

  public nextStep(): StepInfo {
    const currentIndex = OnboardingController.STEPS.findIndex(
      (s) => s.step === this.currentStep
    );
    if (currentIndex < OnboardingController.STEPS.length - 1) {
      this.currentStep = OnboardingController.STEPS[currentIndex + 1].step;
    } else {
      this.currentStep = 'COMPLETED';
      this.isActive = false;
    }
    return this.getStepInfo();
  }

  public prevStep(): StepInfo {
    const currentIndex = OnboardingController.STEPS.findIndex(
      (s) => s.step === this.currentStep
    );
    if (currentIndex > 0) {
      this.currentStep = OnboardingController.STEPS[currentIndex - 1].step;
    }
    return this.getStepInfo();
  }

  public getStepInfo(): StepInfo {
    return (
      OnboardingController.STEPS.find((s) => s.step === this.currentStep) ||
      OnboardingController.STEPS[0]
    );
  }

  public dismiss(): void {
    this.isActive = false;
    this.currentStep = 'COMPLETED';
  }

  public getIsActive(): boolean {
    return this.isActive;
  }
}
