'use client';

// ============================================================================
// Timeline Workspace — Repository Evolution UI
// ============================================================================
// Generated via Stitch AI MCP (project 3088739246801808336, screen a0277a1e)
// Lumina Digital design system — glassmorphic, dark theme
// ============================================================================

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  GitCommit,
  Users,
  FileCode,
  Clock,
  GitBranch,
  Gauge,
  FilePlus,
  FileMinus,
  FileEdit,
  Database,
} from 'lucide-react';
import {
  useEvolutionManager,
  type PlaybackSpeed,
} from '@/evolution/engine/EvolutionManager';

const SPEED_OPTIONS: PlaybackSpeed[] = [0.5, 1, 2, 5, 10];

function formatDate(iso: string): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function TimelineWorkspace() {
  const {
    timeline,
    currentIndex,
    currentEntry,
    isPlaying,
    playbackSpeed,
    selectedBranch,
  } = useEvolutionManager();

  if (!timeline || !currentEntry) return null;

  const totalEntries = timeline.entries.length;
  const progress = totalEntries > 1 ? currentIndex / (totalEntries - 1) : 0;

  // Compute commit density for sparkline (sample 60 buckets)
  const bucketCount = 60;
  const bucketSize = Math.max(1, Math.ceil(totalEntries / bucketCount));
  const densityBars: number[] = [];
  for (let i = 0; i < bucketCount; i++) {
    const start = i * bucketSize;
    const end = Math.min(start + bucketSize, totalEntries);
    let totalChanges = 0;
    for (let j = start; j < end; j++) {
      const e = timeline.entries[j];
      totalChanges +=
        e.filesAdded.length + e.filesRemoved.length + e.filesModified.length;
    }
    densityBars.push(totalChanges);
  }
  const maxDensity = Math.max(1, ...densityBars);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-auto">
      <div
        className="border-t border-white/10 bg-black/60 backdrop-blur-2xl"
        style={{ height: 260 }}
      >
        <div className="h-full flex flex-col px-6 py-4 gap-3">
          {/* ─── Top Section: Controls + Timeline + Speed ─── */}
          <div className="flex items-center gap-4">
            {/* Playback Controls */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => useEvolutionManager.getState().stepBackward()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <SkipBack size={14} />
              </button>

              <button
                onClick={() => useEvolutionManager.getState().togglePlayback()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/80 border border-indigo-400/30 text-white hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-500/20"
              >
                {isPlaying ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} className="ml-0.5" />
                )}
              </button>

              <button
                onClick={() => useEvolutionManager.getState().stepForward()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
              >
                <SkipForward size={14} />
              </button>
            </div>

            {/* Timeline Scrubber */}
            <div className="flex-1 flex flex-col gap-1">
              {/* Sparkline */}
              <div className="flex items-end gap-px h-5">
                {densityBars.map((val, i) => {
                  const h = Math.max(2, (val / maxDensity) * 20);
                  const isActive =
                    i <= Math.floor(progress * (bucketCount - 1));
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-all"
                      style={{
                        height: h,
                        backgroundColor: isActive
                          ? 'rgba(99, 102, 241, 0.6)'
                          : 'rgba(255, 255, 255, 0.08)',
                      }}
                    />
                  );
                })}
              </div>

              {/* Slider */}
              <input
                type="range"
                min={0}
                max={totalEntries - 1}
                value={currentIndex}
                onChange={(e) =>
                  useEvolutionManager
                    .getState()
                    .seekTo(parseInt(e.target.value))
                }
                className="w-full h-1 accent-indigo-500 cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #6366f1 ${progress * 100}%, rgba(255,255,255,0.1) ${progress * 100}%)`,
                }}
              />

              {/* Date Range */}
              <div className="flex justify-between text-[10px] text-white/40 font-mono">
                <span>{formatDate(timeline.startDate)}</span>
                <span className="text-white/60">
                  {currentIndex + 1} / {totalEntries}
                </span>
                <span>{formatDate(timeline.endDate)}</span>
              </div>
            </div>

            {/* Speed + Branch */}
            <div className="flex items-center gap-3 shrink-0">
              {/* Speed Selector */}
              <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-lg p-0.5">
                {SPEED_OPTIONS.map((speed) => (
                  <button
                    key={speed}
                    onClick={() =>
                      useEvolutionManager.getState().setSpeed(speed)
                    }
                    className={`px-2 py-1 text-[10px] font-medium rounded-md transition-all ${
                      playbackSpeed === speed
                        ? 'bg-indigo-500/80 text-white shadow-sm'
                        : 'text-white/40 hover:text-white/70'
                    }`}
                  >
                    {speed}x
                  </button>
                ))}
              </div>

              {/* Branch Selector */}
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5">
                <GitBranch size={12} className="text-white/40" />
                <span className="text-xs text-white/70">
                  {selectedBranch || timeline.defaultBranch}
                </span>
              </div>
            </div>
          </div>

          {/* ─── Bottom Section: Commit Info + Stats + File Changes ─── */}
          <div className="flex-1 grid grid-cols-3 gap-4">
            {/* Left: Current Commit */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <GitCommit size={12} className="text-indigo-400" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  Current Commit
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {/* Avatar */}
                <div className="h-8 w-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-300 font-bold shrink-0">
                  {currentEntry.authorLogin.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-white/90 truncate">
                      {currentEntry.authorLogin}
                    </span>
                    <code className="text-[10px] text-indigo-400/80 font-mono">
                      {currentEntry.commitSha.slice(0, 7)}
                    </code>
                  </div>
                  <p className="text-[11px] text-white/50 truncate mt-0.5">
                    {currentEntry.commitMessage}
                  </p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={9} className="text-white/30" />
                    <span className="text-[10px] text-white/30">
                      {formatDate(currentEntry.date)}
                    </span>
                    {currentEntry.tags.length > 0 && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded-full ml-1">
                        {currentEntry.tags[0]}
                      </span>
                    )}
                    {currentEntry.releaseName && (
                      <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1.5 rounded-full">
                        {currentEntry.releaseName}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Middle: Stats */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <Gauge size={12} className="text-indigo-400" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  Repository State
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                  <FileCode size={13} className="text-blue-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {currentEntry.cumulativeFiles}
                    </div>
                    <div className="text-[9px] text-white/40">Files</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                  <Database size={13} className="text-purple-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {formatSize(currentEntry.cumulativeSize)}
                    </div>
                    <div className="text-[9px] text-white/40">Size</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                  <Users size={13} className="text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {currentEntry.cumulativeAuthors}
                    </div>
                    <div className="text-[9px] text-white/40">Authors</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-white/[0.03] rounded-lg px-2.5 py-1.5">
                  <GitCommit size={13} className="text-amber-400 shrink-0" />
                  <div>
                    <div className="text-sm font-semibold text-white">
                      {currentEntry.cumulativeCommits}
                    </div>
                    <div className="text-[9px] text-white/40">Commits</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: File Changes */}
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3">
              <div className="flex items-center gap-2 mb-2">
                <FileEdit size={12} className="text-indigo-400" />
                <span className="text-[10px] uppercase tracking-widest text-white/40">
                  Changes in This Commit
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 bg-emerald-500/5 border border-emerald-500/10 rounded-lg px-3 py-2">
                  <FilePlus size={14} className="text-emerald-400" />
                  <div className="flex-1">
                    <div className="text-xs text-white/70">Added</div>
                  </div>
                  <span className="text-sm font-semibold text-emerald-400">
                    +{currentEntry.filesAdded.length}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-red-500/5 border border-red-500/10 rounded-lg px-3 py-2">
                  <FileMinus size={14} className="text-red-400" />
                  <div className="flex-1">
                    <div className="text-xs text-white/70">Removed</div>
                  </div>
                  <span className="text-sm font-semibold text-red-400">
                    -{currentEntry.filesRemoved.length}
                  </span>
                </div>

                <div className="flex items-center gap-3 bg-amber-500/5 border border-amber-500/10 rounded-lg px-3 py-2">
                  <FileEdit size={14} className="text-amber-400" />
                  <div className="flex-1">
                    <div className="text-xs text-white/70">Modified</div>
                  </div>
                  <span className="text-sm font-semibold text-amber-400">
                    ~{currentEntry.filesModified.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
