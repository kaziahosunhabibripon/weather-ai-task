type CacheEntry<T> = {
  value: T;
  expiresAt: number;
  createdAt: number;
};

const store = new Map<string, CacheEntry<unknown>>();

export function getCache<T>(key: string) {
  const entry = store.get(key) as CacheEntry<T> | undefined;
  if (!entry) return null;

  return {
    value: entry.value,
    ageSeconds: Math.max(0, Math.round((Date.now() - entry.createdAt) / 1000)),
    isExpired: Date.now() > entry.expiresAt,
  };
}

export function setCache<T>(key: string, value: T, ttlSeconds: number) {
  store.set(key, {
    value,
    createdAt: Date.now(),
    expiresAt: Date.now() + ttlSeconds * 1000,
  });
}
