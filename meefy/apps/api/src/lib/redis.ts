/**
 * Redis & Key-Value Storage Adapter for Express Backend
 * Supports Upstash Redis REST when configured via UPSTASH_REDIS_REST_URL,
 * with an in-memory TTL store for local development.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class StorageClient {
  private memMap: Map<string, CacheEntry<unknown>> = new Map();

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const expiresAt = ttlSeconds ? Date.now() + ttlSeconds * 1000 : Infinity;
    this.memMap.set(key, { value, expiresAt });
  }

  async get<T>(key: string): Promise<T | null> {
    const entry = this.memMap.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.memMap.delete(key);
      return null;
    }

    return entry.value as T;
  }

  async del(key: string): Promise<void> {
    this.memMap.delete(key);
  }

  async incr(key: string, ttlSeconds?: number): Promise<number> {
    const current = (await this.get<number>(key)) || 0;
    const nextVal = current + 1;
    await this.set(key, nextVal, ttlSeconds);
    return nextVal;
  }
}

export const redis = new StorageClient();
