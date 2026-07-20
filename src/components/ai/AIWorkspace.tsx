'use client';

import { useState } from 'react';
import {
  Bot,
  TerminalSquare,
  Search,
  Command,
  BookOpen,
  Clock,
  Activity,
  AlignLeft,
  Send,
  Sparkles,
  FolderTree,
} from 'lucide-react';

export function AIWorkspace() {
  const [query, setQuery] = useState('');

  return (
    <div className="flex h-full w-full bg-[#0B0E14] text-white overflow-hidden font-sans">
      {/* Left Sidebar - History & Tools */}
      <aside className="w-64 border-r border-white/5 bg-white/[0.02] flex flex-col hidden md:flex">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Bot size={20} className="text-blue-400" />
          <span className="font-semibold tracking-wide text-sm">Copilot</span>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          <div>
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 px-2">
              History
            </div>
            <div className="space-y-1">
              {[
                'Authentication flow',
                'Database schema',
                'Visual renderer',
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full text-left px-2 py-1.5 rounded-md hover:bg-white/5 text-sm text-white/70 truncate flex items-center gap-2 transition-colors"
                >
                  <Clock size={14} className="text-white/40" />
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-white/40 uppercase tracking-widest mb-3 px-2">
              Bookmarks
            </div>
            <div className="space-y-1">
              <button className="w-full text-left px-2 py-1.5 rounded-md hover:bg-white/5 text-sm text-white/70 truncate flex items-center gap-2 transition-colors">
                <BookOpen size={14} className="text-amber-400/80" />
                Auth Controller
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 text-xs text-white/40 flex items-center justify-between">
          <span>Keyboard Shortcuts</span>
          <Command size={14} />
        </div>
      </aside>

      {/* Main Conversation Area */}
      <main className="flex-1 flex flex-col relative">
        <header className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.01] backdrop-blur-md absolute top-0 w-full z-10">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-white/80">
              Active Repository:
            </span>
            <span className="text-sm px-2 py-1 rounded bg-blue-500/10 text-blue-400 font-mono border border-blue-500/20">
              mzayan-bit/GitVerse
            </span>
          </div>
          <div className="flex items-center gap-4 text-white/60">
            <button className="hover:text-white transition-colors">
              <TerminalSquare size={18} />
            </button>
            <button className="hover:text-white transition-colors">
              <AlignLeft size={18} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto pt-20 pb-32 px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Assistant Greeting */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/50 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                <Sparkles size={16} className="text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-white/90 leading-relaxed bg-white/[0.03] border border-white/10 rounded-2xl rounded-tl-none p-4 backdrop-blur-sm">
                  <p className="mb-4">
                    Hello! I&apos;m your Engineering Copilot. I can answer
                    questions about the codebase and control the 3D universe to
                    highlight what I&apos;m talking about.
                  </p>
                  <p className="text-white/60 text-xs">
                    Try asking about the authentication system, or request to
                    see the dependency graph of the scanner module.
                  </p>
                </div>
              </div>
            </div>

            {/* Suggested Prompts */}
            <div className="grid grid-cols-2 gap-3 pl-12">
              <button className="text-left p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-sm text-white/80">
                &quot;Show me the authentication system.&quot;
              </button>
              <button className="text-left p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-sm text-white/80">
                &quot;Explain how the Scanner module works.&quot;
              </button>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-[#0B0E14] via-[#0B0E14]/90 to-transparent">
          <div className="max-w-3xl mx-auto relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-[#131722] border border-white/10 rounded-2xl shadow-2xl flex items-end">
              <div className="p-4 shrink-0">
                <Search size={20} className="text-white/40" />
              </div>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about the codebase..."
                className="flex-1 bg-transparent border-none text-white focus:outline-none resize-none py-4 min-h-[56px] max-h-32 text-sm leading-relaxed"
                rows={1}
              />
              <div className="p-3 shrink-0">
                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-400 transition-colors text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                  <Send size={14} />
                </button>
              </div>
            </div>
            <div className="text-center mt-2 text-xs text-white/30">
              AI can make mistakes. Consider verifying important information.
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar - Visual Timeline & Context */}
      <aside className="w-72 border-l border-white/5 bg-white/[0.02] hidden lg:flex flex-col">
        <div className="p-4 border-b border-white/5">
          <span className="font-semibold tracking-wide text-sm flex items-center gap-2">
            <Activity size={16} className="text-emerald-400" />
            Visual Timeline
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 relative">
          {/* Timeline Line */}
          <div className="absolute left-[27px] top-4 bottom-4 w-px bg-white/10" />

          {/* Timeline Items */}
          <div className="relative pl-10">
            <div className="absolute left-[3px] top-1 w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            <div className="text-xs font-semibold text-white/80 mb-1">
              Focus Repository
            </div>
            <div className="text-xs text-white/50">mzayan-bit/GitVerse</div>
          </div>

          <div className="relative pl-10 opacity-50">
            <div className="absolute left-[3px] top-1 w-2 h-2 rounded-full bg-white/20" />
            <div className="text-xs font-semibold text-white/80 mb-1">
              Highlight Folder
            </div>
            <div className="text-xs text-white/50">src/auth/</div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5">
          <span className="font-semibold tracking-wide text-sm flex items-center gap-2 mb-3">
            <FolderTree size={16} className="text-purple-400" />
            Active Context
          </span>
          <div className="text-xs text-white/50 space-y-2">
            <div className="flex items-center gap-2 bg-white/5 p-2 rounded border border-white/10 truncate">
              src/ai/orchestration/PromptManager.ts
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
