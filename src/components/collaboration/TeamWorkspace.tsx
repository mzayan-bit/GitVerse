import { useState } from 'react';
import {
  Users,
  Eye,
  MessageCircle,
  Search as SearchIcon,
  UserPlus,
  Radio,
  X,
  Circle,
  MonitorPlay,
} from 'lucide-react';
import { useSharedState } from '@/collaboration/sync/SharedStateStore';
import { CollaborationServer } from '@/collaboration/core/CollaborationServer';
import { InvestigationBoard } from './InvestigationBoard';

export function TeamWorkspace() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'presence' | 'activity' | 'investigations'
  >('presence');
  const remotePresence = useSharedState((s) => s.remotePresence);
  const followingUserId = useSharedState((s) => s.followingUserId);
  const followUser = useSharedState((s) => s.followUser);
  const isObserving = useSharedState((s) => s.isObserving);
  const setObserving = useSharedState((s) => s.setObserving);

  const server = CollaborationServer.getInstance();
  const session = server.getActiveSession();
  const activityLog = server.getActivityLog();
  const participants = session?.participants ?? [];
  const presenceEntries = Object.values(remotePresence);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 p-4 rounded-full bg-indigo-900/60 backdrop-blur-xl border border-indigo-500/30 hover:border-indigo-400/80 shadow-[0_0_30px_rgba(99,102,241,0.3)] transition-all group"
      >
        <Users className="w-6 h-6 text-indigo-300 group-hover:text-indigo-200" />
        {participants.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] flex items-center justify-center font-bold">
            {participants.length}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed left-4 top-20 bottom-4 w-[380px] z-50 flex flex-col bg-black/90 backdrop-blur-3xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-gradient-to-r from-indigo-900/30 to-transparent">
        <div className="flex items-center gap-3">
          <Users className="w-5 h-5 text-indigo-400" />
          <h2 className="text-base font-bold text-white tracking-widest uppercase">
            Team
          </h2>
          <span className="ml-2 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold">
            {participants.length} online
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Tab Bar */}
      <div className="flex px-4 py-2 gap-1 border-b border-white/10 bg-black/50">
        {(['presence', 'activity', 'investigations'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg capitalize text-xs transition-all ${
              activeTab === tab
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/5">
        <button
          onClick={() => setObserving(!isObserving)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all ${
            isObserving
              ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              : 'text-gray-500 hover:text-white border border-transparent hover:bg-white/5'
          }`}
        >
          <Eye className="w-3 h-3" />
          {isObserving ? 'Observing' : 'Observe'}
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-white/5 border border-transparent transition-all">
          <MonitorPlay className="w-3 h-3" />
          Present
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'presence' && (
          <div className="p-4 space-y-2">
            {participants.map((p) => {
              const presence = remotePresence[p.id];
              const isFollowing = followingUserId === p.id;

              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group"
                >
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.name.charAt(0).toUpperCase()}
                    </div>
                    <Circle
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${
                        presence?.isIdle ? 'text-yellow-500' : 'text-green-500'
                      } fill-current`}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-xs font-semibold truncate">
                      {p.name}
                    </div>
                    <div className="text-gray-500 text-[10px] uppercase tracking-wider">
                      {p.role}{' '}
                      {presence?.selectedEntityId
                        ? `· Viewing ${presence.selectedEntityId}`
                        : ''}
                    </div>
                  </div>

                  {/* Follow Button */}
                  <button
                    onClick={() => followUser(isFollowing ? null : p.id)}
                    className={`p-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100 ${
                      isFollowing
                        ? 'bg-indigo-500/30 text-indigo-300'
                        : 'hover:bg-white/10 text-gray-500 hover:text-white'
                    }`}
                    title={isFollowing ? 'Unfollow' : 'Follow camera'}
                  >
                    <Radio className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}

            {participants.length === 0 && (
              <div className="text-center py-12 text-gray-600">
                <UserPlus className="w-8 h-8 mx-auto mb-3 opacity-30" />
                <p className="text-xs">No participants yet.</p>
                <p className="text-[10px] text-gray-700 mt-1">
                  Create a session to collaborate.
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="p-4 space-y-1">
            {activityLog.length === 0 && (
              <p className="text-center text-gray-600 text-xs py-12">
                No activity yet.
              </p>
            )}
            {activityLog
              .slice()
              .reverse()
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-white/5"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="text-xs text-gray-300">
                      <span className="text-white font-semibold">
                        {event.participantName}
                      </span>{' '}
                      {event.action}{' '}
                      <span className="text-indigo-400">{event.details}</span>
                    </div>
                    <div className="text-[10px] text-gray-600 mt-0.5">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === 'investigations' && <InvestigationBoard />}
      </div>
    </div>
  );
}
