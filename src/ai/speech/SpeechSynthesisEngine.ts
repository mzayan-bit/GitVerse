export class SpeechSynthesisEngine {
  private static instance: SpeechSynthesisEngine | null = null;
  private isSpeaking = false;

  public static getInstance(): SpeechSynthesisEngine {
    if (!SpeechSynthesisEngine.instance) {
      SpeechSynthesisEngine.instance = new SpeechSynthesisEngine();
    }
    return SpeechSynthesisEngine.instance;
  }

  public speak(text: string): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        this.isSpeaking = true;
      };
      utterance.onend = () => {
        this.isSpeaking = false;
      };

      window.speechSynthesis.speak(utterance);
    }
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public getIsSpeaking(): boolean {
    return this.isSpeaking;
  }
}
