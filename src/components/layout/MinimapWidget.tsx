import { Compass } from 'lucide-react';

export function MinimapWidget() {
  return (
    <div className="fixed bottom-8 left-16 z-30 p-2.5 rounded-2xl bg-[#0B0F17]/85 backdrop-blur-xl border border-white/10 text-white text-[10px] font-mono select-none flex items-center gap-3 shadow-xl">
      {/* 2D Circular Radar Screen */}
      <div className="relative w-10 h-10 rounded-full border border-purple-500/40 bg-purple-950/30 flex items-center justify-center overflow-hidden">
        <div className="absolute w-full h-[1px] bg-purple-500/20" />
        <div className="absolute h-full w-[1px] bg-purple-500/20" />
        {/* Radar Sweep Arc */}
        <div className="absolute w-full h-full rounded-full border-t border-r border-cyan-400 animate-spin-slow" />
        {/* Center Target Dot */}
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
      </div>

      <div>
        <div className="flex items-center gap-1 text-purple-300 font-semibold mb-0.5">
          <Compass className="w-3 h-3 text-purple-400" />
          <span>SECTOR 01</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400 text-[9px]">
          <span>X: 000</span>
          <span>Y: 400</span>
          <span>Z: 800</span>
        </div>
      </div>
    </div>
  );
}
