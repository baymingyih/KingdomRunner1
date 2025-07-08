import LRUCache from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number>({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000,
  });

  return {
    check: (limit: number, token: string) => new Promise<void>((resolve, reject) => {
      const tokenCount = tokenCache.get(token) || 0;
      tokenCache.set(token, tokenCount + 1);

      if (tokenCount >= limit) {
        reject();
      } else {
        resolve();
      }
    }),
  };
}
