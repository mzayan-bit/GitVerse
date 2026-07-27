import { Bookmark } from 'lucide-react';
import { useCameraRig } from '@/navigation/camera/CameraRig';

export function BookmarksPanel() {
  const bookmarks = useCameraRig((s) => s.bookmarks);
  const goToBookmark = useCameraRig.getState().goToBookmark;

  return (
    <div className="space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-amber-400">
        <Bookmark className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          Camera Bookmarks ({bookmarks.length})
        </span>
      </div>

      {bookmarks.length === 0 ? (
        <p className="text-gray-500 text-[11px]">
          No bookmarks saved yet. Save camera views from the Navigation HUD.
        </p>
      ) : (
        <div className="space-y-1.5">
          {bookmarks.map((b) => (
            <div
              key={b.id}
              onClick={() => goToBookmark(b.id)}
              className="p-2.5 rounded-lg bg-white/5 border border-white/5 hover:border-amber-400/40 cursor-pointer flex justify-between items-center"
            >
              <span className="font-medium text-white">{b.label}</span>
              <span className="text-[9px] uppercase font-mono text-amber-400">
                Jump →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
