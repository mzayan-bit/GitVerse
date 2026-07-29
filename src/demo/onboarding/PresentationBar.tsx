import { useState, useEffect } from 'react';
import {
  Play,
  SkipForward,
  SkipBack,
  Video,
  Clock,
  Bookmark,
  X,
} from 'lucide-react';
import { PresentationModeController } from './PresentationModeController';

export function PresentationBar() {
  const controller = PresentationModeController.getInstance();
  const [isPresenting, setIsPresenting] = useState(
    controller.getIsPresenting()
  );
  const [timerText, setTimerText] = useState(controller.getTimerFormatted());
  const [currentScene, setCurrentScene] = useState(
    controller.getCurrentBookmark()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPresenting(controller.getIsPresenting());
      setTimerText(controller.getTimerFormatted());
      setCurrentScene(controller.getCurrentBookmark());
    }, 500);
    return () => clearInterval(interval);
  }, [controller]);

  if (!isPresenting) return null;

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 p-2.5 rounded-2xl bg-black/90 backdrop-blur-2xl border border-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.4)] text-white text-xs font-sans select-none flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
      {/* Keynote Mode Badge */}
      <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-300">
        <Video className="w-4 h-4 text-indigo-400 animate-pulse" />
        <span className="font-bold text-xs">KEYNOTE MODE</span>
      </div>

      {/* Timer */}
      <div className="flex items-center gap-1.5 font-mono text-cyan-300 font-bold px-2 py-1 rounded bg-white/5 border border-white/10">
        <Clock className="w-3.5 h-3.5 text-cyan-400" />
        <span>{timerText}</span>
      </div>

      {/* Scene Selector */}
      <div className="flex items-center gap-2 border-x border-white/10 px-3">
        <Bookmark className="w-3.5 h-3.5 text-amber-400" />
        <span className="font-semibold text-xs text-white max-w-[200px] truncate">
          {currentScene.name}
        </span>
      </div>

      {/* Presentation Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => controller.prevScene()}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          title="Previous Scene"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => controller.toggleAutoPlay()}
          className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          title="Play / Pause Scene Auto-Play"
        >
          <Play className="w-3.5 h-3.5 fill-white" />
        </button>

        <button
          onClick={() => controller.nextScene()}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all"
          title="Next Scene"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Exit Button */}
      <button
        onClick={() => controller.stopPresentation()}
        className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 transition-all ml-2"
        title="Exit Keynote Mode"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
