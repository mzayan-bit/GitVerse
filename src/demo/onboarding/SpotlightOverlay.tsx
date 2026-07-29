import { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, X, CheckCircle } from 'lucide-react';
import { OnboardingController, StepInfo } from './OnboardingController';

export function SpotlightOverlay() {
  const controller = OnboardingController.getInstance();
  const [stepInfo, setStepInfo] = useState<StepInfo>(controller.getStepInfo());
  const [isActive, setIsActive] = useState(controller.getIsActive());

  if (!isActive || stepInfo.step === 'COMPLETED') return null;

  const handleNext = () => {
    const next = controller.nextStep();
    setStepInfo(next);
    setIsActive(controller.getIsActive());
  };

  const handlePrev = () => {
    const prev = controller.prevStep();
    setStepInfo(prev);
  };

  const handleDismiss = () => {
    controller.dismiss();
    setIsActive(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg p-4 rounded-xl bg-black/85 backdrop-blur-2xl border border-indigo-500/40 shadow-[0_0_30px_rgba(99,102,241,0.3)] text-white text-xs font-sans select-none animate-in fade-in slide-in-from-bottom-4">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-indigo-500/20 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-semibold text-sm">{stepInfo.title}</span>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Step Description */}
      <p className="text-gray-300 leading-relaxed mb-3 text-[11px]">
        {stepInfo.description}
      </p>

      {/* Progress & Controls */}
      <div className="flex items-center justify-between border-t border-white/10 pt-2.5">
        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-mono">
          <CheckCircle className="w-3 h-3 text-indigo-400" />
          <span>Interactive Product Tour</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-300 text-[11px] font-medium transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>Back</span>
          </button>

          <button
            onClick={handleNext}
            className="px-3 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-semibold transition-all flex items-center gap-1 shadow-[0_0_12px_rgba(99,102,241,0.4)]"
          >
            <span>Next</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
