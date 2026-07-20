import { Message } from '../providers/AITypes';

export class ConversationMemory {
  private messages: Message[] = [];
  private maxHistory: number = 20;

  constructor(maxHistory?: number) {
    if (maxHistory) this.maxHistory = maxHistory;
  }

  public addMessage(message: Message) {
    this.messages.push(message);
    if (this.messages.length > this.maxHistory) {
      // Remove oldest message, but try to preserve the system prompt if it's first
      if (this.messages[0].role === 'system') {
        this.messages.splice(1, 1);
      } else {
        this.messages.shift();
      }
    }
  }

  public getMessages(): Message[] {
    return [...this.messages];
  }

  public clear() {
    // Preserve system prompt if exists
    const sys = this.messages.find((m) => m.role === 'system');
    this.messages = sys ? [sys] : [];
  }
}
