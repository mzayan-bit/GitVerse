import { Bot, Send } from 'lucide-react';
import { useState } from 'react';

export function AIAssistantPanel() {
  const [messages, setMessages] = useState<
    Array<{ role: 'user' | 'assistant'; text: string }>
  >([
    {
      role: 'assistant',
      text: 'Hello! How can I assist with your engineering twin universe today?',
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', text: input },
      {
        role: 'assistant',
        text: `Analyzing topology for "${input}"... All microservices stable.`,
      },
    ]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full space-y-3 text-xs text-gray-300">
      <div className="flex items-center gap-2 pb-2 border-b border-white/5 text-indigo-400">
        <Bot className="w-4 h-4" />
        <span className="font-semibold uppercase tracking-wider text-[10px]">
          AI Copilot
        </span>
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto max-h-64 pr-1">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-xl text-xs max-w-[85%] ${
              m.role === 'user'
                ? 'bg-indigo-600/80 text-white ml-auto'
                : 'bg-white/10 text-gray-200 border border-white/5'
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2 border-t border-white/5">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask AI Copilot..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
        />
        <button
          onClick={handleSend}
          className="p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
