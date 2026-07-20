export class CircuitBreaker {
  private failures = 0;
  private threshold = 5;
  private timeout = 60000; // 1 minute
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(threshold?: number, timeout?: number) {
    if (threshold) this.threshold = threshold;
    if (timeout) this.timeout = timeout;
  }

  public async execute<T>(action: () => Promise<T>): Promise<T> {
    if (this.isOpen()) {
      throw new Error('Circuit Breaker is OPEN. Request rejected.');
    }

    try {
      const result = await action();
      this.reset();
      return result;
    } catch (e) {
      this.recordFailure();
      throw e;
    }
  }

  private isOpen(): boolean {
    if (this.state === 'OPEN') {
      const now = Date.now();
      if (now - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
        return false;
      }
      return true;
    }
    return false;
  }

  private recordFailure() {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold || this.state === 'HALF_OPEN') {
      this.state = 'OPEN';
    }
  }

  private reset() {
    this.failures = 0;
    this.state = 'CLOSED';
  }
}
