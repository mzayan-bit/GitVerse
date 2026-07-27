import { useState } from 'react';
import { usePanelStore, PanelInstance } from '../PanelController';
import { PANEL_REGISTRY } from '../PanelRegistry';
import {
  Pin,
  Minus,
  Maximize2,
  Minimize2,
  X,
  Move,
  PanelLeft,
  PanelRight,
  PanelBottom,
  ExternalLink,
} from 'lucide-react';

interface DockableWindowContainerProps {
  panel: PanelInstance;
  children: React.ReactNode;
}

export function DockableWindowContainer({
  panel,
  children,
}: DockableWindowContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const meta = PANEL_REGISTRY[panel.type];

  const closePanel = usePanelStore((s) => s.closePanel);
  const togglePin = usePanelStore((s) => s.togglePin);
  const toggleMinimize = usePanelStore((s) => s.toggleMinimize);
  const setDockPosition = usePanelStore((s) => s.setDockPosition);
  const bringToFront = usePanelStore((s) => s.bringToFront);

  if (panel.isMinimized) return null;

  const isFloating = panel.dockPosition === 'floating';

  return (
    <div
      onPointerDown={() => bringToFront(panel.id)}
      style={
        isFloating && !isFullscreen
          ? {
              position: 'fixed',
              left: `${panel.bounds.x}px`,
              top: `${panel.bounds.y}px`,
              width: `${panel.bounds.w}px`,
              height: `${panel.bounds.h}px`,
              zIndex: panel.zIndex,
            }
          : isFullscreen
            ? {
                position: 'fixed',
                inset: 0,
                zIndex: 999,
              }
            : {
                width: '100%',
                height: '100%',
              }
      }
      className={`bg-black/90 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden text-white transition-all ${
        isFloating
          ? 'pointer-events-auto shadow-[0_10px_40px_rgba(0,0,0,0.8)]'
          : ''
      }`}
    >
      {/* Panel Window Header */}
      <div className="h-9 px-3 border-b border-white/10 bg-white/5 flex items-center justify-between cursor-move select-none">
        <div className="flex items-center gap-2">
          <Move className="w-3.5 h-3.5 text-gray-500" />
          <span className="text-xs font-medium text-gray-200">
            {meta?.title || panel.type}
          </span>
        </div>

        {/* Window Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => togglePin(panel.id)}
            title={panel.isPinned ? 'Unpin' : 'Pin'}
            className={`p-1 rounded transition-colors ${
              panel.isPinned
                ? 'text-indigo-400 bg-indigo-500/20'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Pin className="w-3 h-3" />
          </button>

          {/* Dock Switcher Quick Actions */}
          <button
            onClick={() => setDockPosition(panel.id, 'left')}
            title="Dock Left"
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <PanelLeft className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDockPosition(panel.id, 'right')}
            title="Dock Right"
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <PanelRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDockPosition(panel.id, 'bottom')}
            title="Dock Bottom"
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <PanelBottom className="w-3 h-3" />
          </button>
          <button
            onClick={() => setDockPosition(panel.id, 'floating')}
            title="Float Window"
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
          </button>

          <div className="w-px h-3 bg-white/10 mx-0.5" />

          <button
            onClick={() => toggleMinimize(panel.id)}
            title="Minimize"
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Restore' : 'Fullscreen'}
            className="p-1 text-gray-400 hover:text-white rounded transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-3 h-3" />
            ) : (
              <Maximize2 className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={() => closePanel(panel.id)}
            title="Close"
            className="p-1 text-gray-400 hover:text-red-400 rounded transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Panel Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
        {children}
      </div>
    </div>
  );
}
