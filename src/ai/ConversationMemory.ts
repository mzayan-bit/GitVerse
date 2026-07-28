export interface ConversationMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  intent?: string;
  actionTaken?: string;
  highlightedNodes?: string[];
  suggestedPrompts?: string[];
}

export class ConversationMemory {
  private static instance: ConversationMemory | null = null;
  private messages: ConversationMessage[] = [];

  private constructor() {
    // Initial welcome message
    this.messages.push({
      id: 'msg-init',
      sender: 'assistant',
      text: 'Hello! I am your Spatial AI Engineering Assistant. Ask me anything like "Take me to authentication", "Why is production slow?", or "Find circular dependencies".',
      timestamp: Date.now(),
      suggestedPrompts: [
        'Take me to authentication',
        'Explain this repository',
        'Why is production slow?',
        'Show everything using Redis',
        'Find circular dependencies',
        'Perform architecture review',
      ],
    });
  }

  public static getInstance(): ConversationMemory {
    if (!ConversationMemory.instance) {
      ConversationMemory.instance = new ConversationMemory();
    }
    return ConversationMemory.instance;
  }

  public addMessage(
    msg: Omit<ConversationMessage, 'id' | 'timestamp'>
  ): ConversationMessage {
    const fullMsg: ConversationMessage = {
      ...msg,
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: Date.now(),
    };
    this.messages.push(fullMsg);
    return fullMsg;
  }

  public getMessages(): ConversationMessage[] {
    return this.messages;
  }

  public clearMemory(): void {
    this.messages = [];
  }
}
