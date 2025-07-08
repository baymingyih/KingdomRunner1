declare module 'lru-cache' {
  class LRUCache<K, V> {
    constructor(options: {
      max?: number;
      maxSize?: number;
      ttl?: number;
      sizeCalculation?: (value: V, key: K) => number;
    });
    set(key: K, value: V): boolean;
    get(key: K): V | undefined;
    has(key: K): boolean;
    delete(key: K): boolean;
    clear(): void;
  }

  export = LRUCache;
}
