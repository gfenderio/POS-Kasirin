import { LRUCache } from 'lru-cache';

// Global cache instance
// In Next.js development, global variables can be cleared on hot reload. 
// We attach it to the global object to persist it.
const globalForCache = global as unknown as {
    posCache: LRUCache<string, any> | undefined
};

export const posCache =
    globalForCache.posCache ??
    new LRUCache<string, any>({
        max: 500, // Maximum number of items in cache
        ttl: 1000 * 60 * 5, // Default 5 minutes Time To Live
        allowStale: false,
    });

if (process.env.NODE_ENV !== 'production') globalForCache.posCache = posCache;

export default posCache;
