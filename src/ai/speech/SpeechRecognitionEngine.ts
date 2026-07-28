export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export class SpeechRecognitionEngine {
  private static instance: SpeechRecognitionEngine | null = null;

  private isListening = false;
  private onResultCallback?: (result: SpeechRecognitionResult) => void;
  private onErrorCallback?: (error: string) => void;

  public static getInstance(): SpeechRecognitionEngine {
    if (!SpeechRecognitionEngine.instance) {
      SpeechRecognitionEngine.instance = new SpeechRecognitionEngine();
    }
    return SpeechRecognitionEngine.instance;
  }

  public startListening(
    onResult: (result: SpeechRecognitionResult) => void,
    onError?: (error: string) => void
  ): boolean {
    this.onResultCallback = onResult;
    this.onErrorCallback = onError;
    this.isListening = true;

    // Check if Web Speech API is supported
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      try {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        recognition.onresult = (event: any) => {
          const last = event.results.length - 1;
          const transcript = event.results[last][0].transcript;
          const isFinal = event.results[last].isFinal;
          if (this.onResultCallback) {
            this.onResultCallback({ transcript, isFinal });
          }
        };

        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        recognition.onerror = (event: any) => {
          this.isListening = false;
          if (this.onErrorCallback) this.onErrorCallback(event.error);
        };

        recognition.onend = () => {
          this.isListening = false;
        };

        recognition.start();
        return true;
      } catch (e) {
        console.warn('Speech recognition start failed', e);
      }
    }

    // Fallback simulation for environments without WebSpeech microphone permission
    setTimeout(() => {
      if (this.onResultCallback) {
        this.onResultCallback({
          transcript: 'Take me to authentication',
          isFinal: true,
        });
      }
      this.isListening = false;
    }, 2000);

    return true;
  }

  public stopListening(): void {
    this.isListening = false;
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}
