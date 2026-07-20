export class RetryPolicy {
  public static async withExponentialBackoff<T>(
    action: () => Promise<T>,
    maxRetries: number = 3,
    baseDelayMs: number = 1000
  ): Promise<T> {
    let attempt = 0;
    while (attempt < maxRetries) {
      try {
        return await action();
      } catch (e) {
        attempt++;
        if (attempt >= maxRetries) {
          throw e;
        }
        const delay = baseDelayMs * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
    throw new Error('RetryPolicy exhausted');
  }
}
