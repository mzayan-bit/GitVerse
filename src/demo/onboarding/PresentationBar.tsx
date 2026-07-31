import { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Video,
  Clock,
  Bookmark,
  X,
  Sparkles,
} from 'lucide-react';
import { PresentationModeController } from './PresentationModeController';

export function PresentationBar() {
  const controller = PresentationModeController.getInstance();
  const [isPresenting, setIsPresenting] = useState(
    controller.getIsPresenting()
  );
  const [isAutoPlaying, setIsAutoPlaying] = useState(
    controller.getIsAutoPlaying()
  );
  const [timerText, setTimerText] = useState(controller.getTimerFormatted());
  const [currentScene, setCurrentScene] = useState(
    controller.getCurrentBookmark()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPresenting(controller.getIsPresenting());
      setIsAutoPlaying(controller.getIsAutoPlaying());
      setTimerText(controller.getTimerFormatted());
      setCurrentScene(controller.getCurrentBookmark());
    }, 300);
    return () => clearInterval(interval);
  }, [controller]);

  if (!isPresenting) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 select-none font-sans animate-in fade-in slide-in-from-top-4 duration-300">
      {/* Top Controls Floating Bar */}
      <div className="p-2.5 rounded-2xl bg-[#0B0F17]/95 backdrop-blur-2xl border border-purple-500/40 shadow-[0_0_40px_rgba(139,92,246,0.3)] text-white text-xs flex items-center gap-3">
        {/* Keynote Mode Badge */}
        <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300">
          <Video className="w-4 h-4 text-purple-400 animate-pulse" />
          <span className="font-bold text-xs tracking-wide uppercase">
            KEYNOTE SHOWCASE
          </span>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-1.5 font-mono text-cyan-300 font-bold px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{timerText}</span>
        </div>

        {/* Scene Selector */}
        <div className="flex items-center gap-2 border-x border-white/10 px-3">
          <Bookmark className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-semibold text-xs text-white max-w-[220px] truncate">
            {currentScene.name}
          </span>
        </div>

        {/* Presentation Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => controller.prevScene()}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            title="Previous Scene"
            aria-label="Previous Keynote Scene"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => controller.toggleAutoPlay()}
            className="p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white transition-all shadow-[0_0_12px_rgba(139,92,246,0.5)]"
            title={isAutoPlaying ? 'Pause Auto-Play' : 'Play Auto-Play'}
            aria-label="Toggle Keynote Auto Play"
          >
            {isAutoPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white" />
            )}
          </button>

          <button
            onClick={() => controller.nextScene()}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
            title="Next Scene"
            aria-label="Next Keynote Scene"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Exit Button */}
        <button
          onClick={() => controller.stopPresentation()}
          className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition-all ml-1"
          title="Exit Keynote Mode"
          aria-label="Exit Keynote Mode"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Live Keynote Teleprompter Narrative Bar */}
      <div className="max-w-xl w-full px-4 py-2.5 rounded-xl bg-[#0B0F17]/90 backdrop-blur-xl border border-white/10 shadow-xl flex items-center gap-2.5 text-center text-xs text-gray-200">
        <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
        <span className="flex-1 text-[11px] leading-relaxed text-gray-300 italic">
          &quot;{currentScene.narrative}&quot;
        </span>
      </div>
    </div>
  );
}
