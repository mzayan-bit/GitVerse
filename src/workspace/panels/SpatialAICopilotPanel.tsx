import { useState } from 'react';
import { Bot, Mic, Send, Compass, Zap, Volume2, RefreshCw } from 'lucide-react';
import { CopilotEngine } from '@/ai/CopilotEngine';
import {
  ConversationMemory,
  ConversationMessage,
} from '@/ai/ConversationMemory';
import { ContextManager } from '@/ai/ContextManager';
import { SpeechRecognitionEngine } from '@/ai/speech/SpeechRecognitionEngine';
import { SpeechSynthesisEngine } from '@/ai/speech/SpeechSynthesisEngine';

export function SpatialAICopilotPanel() {
  const memory = ConversationMemory.getInstance();
  const contextMgr = ContextManager.getInstance();
  const copilotEngine = CopilotEngine.getInstance();
  const speechRec = SpeechRecognitionEngine.getInstance();
  const speechSynth = SpeechSynthesisEngine.getInstance();

  const [messages, setMessages] = useState<ConversationMessage[]>(
    memory.getMessages()
  );
  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const context = contextMgr.getContext();

  const handleSendPrompt = async (textToSend?: string) => {
    const promptText = textToSend || inputPrompt;
    if (!promptText.trim() || isProcessing) return;

    setInputPrompt('');
    setIsProcessing(true);

    const reply = await copilotEngine.processPrompt(promptText);

    setMessages([...memory.getMessages()]);
    setIsProcessing(false);

    // Speak response if voice feedback desired
    speechSynth.speak(reply.text);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      speechRec.stopListening();
      setIsListening(false);
    } else {
      setIsListening(true);
      speechRec.startListening(
        (result) => {
          setInputPrompt(result.transcript);
          if (result.isFinal) {
            setIsListening(false);
            handleSendPrompt(result.transcript);
          }
        },
        () => setIsListening(false)
      );
    }
  };

  return (
    <div className="flex flex-col h-full text-xs font-sans text-gray-200 select-none space-y-3">
      {/* Copilot Header */}
      <div className="p-3 rounded-lg bg-indigo-950/30 border border-indigo-500/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="w-4 h-4 text-indigo-400" />
          <span className="font-semibold text-white text-sm">
            Spatial AI Copilot
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleToggleVoice}
            className={`p-1.5 rounded transition-all flex items-center gap-1 text-[11px] font-medium ${
              isListening
                ? 'bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse'
                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30'
            }`}
            title="Voice Commands"
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{isListening ? 'Listening...' : 'Voice'}</span>
          </button>
        </div>
      </div>

      {/* Spatial Context Awareness Bar */}
      <div className="p-2 rounded bg-white/5 border border-white/10 flex items-center justify-between text-[10px] text-gray-400 font-mono">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <Compass className="w-3.5 h-3.5" />
          <span>
            Context: {context.selectedEntityName || '3D Universe Overview'}
          </span>
        </div>
        {context.highlightedEntityIds.length > 0 && (
          <span className="text-amber-300 font-bold">
            {context.highlightedEntityIds.length} Nodes Highlighted
          </span>
        )}
      </div>

      {/* Conversation Timeline */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2.5 rounded-lg border transition-all ${
              msg.sender === 'user'
                ? 'bg-indigo-600/20 border-indigo-500/30 ml-4 text-white'
                : 'bg-black/60 border-white/10 mr-2 text-gray-200'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
              <span className="font-semibold text-indigo-300">
                {msg.sender === 'user' ? 'You' : 'Spatial AI'}
              </span>
              <span className="font-mono">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <p className="leading-relaxed">{msg.text}</p>

            {/* Action Badges */}
            {msg.actionTaken && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-cyan-300 font-mono">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Action: {msg.actionTaken}</span>
              </div>
            )}

            {/* Suggested Follow-up Prompts */}
            {msg.suggestedPrompts && (
              <div className="mt-2.5 pt-2 border-t border-white/10 space-y-1">
                <span className="text-[10px] text-gray-400 block font-medium">
                  Suggested Next Steps:
                </span>
                <div className="flex flex-wrap gap-1">
                  {msg.suggestedPrompts.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendPrompt(prompt)}
                      className="px-2 py-0.5 rounded bg-white/5 hover:bg-indigo-500/20 border border-white/10 text-[10px] text-indigo-300 hover:text-white transition-all text-left"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {isProcessing && (
          <div className="p-2.5 rounded-lg bg-indigo-950/20 border border-indigo-500/30 text-indigo-300 flex items-center gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            <span>Reasoning across 3D universe & knowledge graph...</span>
          </div>
        )}
      </div>

      {/* Input Form & Voice Controls */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendPrompt();
        }}
        className="pt-2 border-t border-white/10 flex gap-2"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Ask AI: 'Take me to authentication', 'Why is production slow?'..."
            className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 pr-8 font-sans"
          />
          <button
            type="button"
            onClick={() =>
              speechSynth.speak(
                'GitVerse Spatial AI Copilot is active and listening.'
              )
            }
            className="absolute right-2 top-2 text-gray-400 hover:text-white"
            title="Read Last Response"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!inputPrompt.trim() || isProcessing}
          className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium flex items-center justify-center transition-all shadow-[0_0_12px_rgba(99,102,241,0.4)]"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
