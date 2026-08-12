export type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

export class LRUTTLCache<K, V> {
  private maxSize: number;
  private defaultTtlMs: number;
  private cache = new Map<K, CacheEntry<V>>();

  constructor(maxSize = 20, defaultTtlMs = 5 * 60 * 1000,initialEntries: [K, CacheEntry<V>][] = []) {
    this.maxSize = maxSize;
    this.defaultTtlMs = defaultTtlMs;
    const now = Date.now();
    const validEntries = initialEntries.filter(
      ([_, entry]) => now < entry.expiresAt
    );

    this.cache = new Map(validEntries);
  }

  get(key: K): V | null {
    if (!this.cache.has(key)) return null;

    const entry = this.cache.get(key)!;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.data;
  }

  set(key: K, value: V, ttlMs = this.defaultTtlMs): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } 
    
    else if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) {
        this.cache.delete(oldestKey);
      }
    }

    this.cache.set(key, {
      data: value,
      expiresAt: Date.now() + ttlMs,
    });
  }

  toEntries(): [K, CacheEntry<V>][] {
    return Array.from(this.cache.entries());
  }

  clear(): void {
    this.cache.clear();
  }
}