interface CacheEntry {
  data: string;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();

export const getCachedData = (key: string): string | null => {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};

export const setCachedData = (key: string, data: string, ttlSeconds: number): void => {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  cache.set(key, { data, expiresAt });
};
