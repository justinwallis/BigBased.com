/**
 * Caching utilities for domain configurations
 * Uses Redis when available, falls back to memory cache
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

// In-memory cache as fallback
const memoryCache = new Map<string, CacheEntry<any>>()

/**
 * Get cached domain configuration
 * Falls back gracefully if Redis is unavailable
 */
export async function getCachedDomainConfig(domain: string): Promise<any | null> {
  const cacheKey = `domain:${domain}`

  try {
    // Try Redis first (if available)
    if (process.env.REDIS_URL || process.env.KV_REST_API_URL) {
      const cached = await getFromRedis(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
    }

    // Fallback to memory cache
    const memCached = memoryCache.get(cacheKey)
    if (memCached && !isCacheExpired(memCached)) {
      return memCached.data
    }

    return null
  } catch (error) {
    console.warn("Cache lookup failed, continuing without cache:", error)
    return null
  }
}

/**
 * Set cached domain configuration
 */
export async function setCachedDomainConfig(domain: string, config: any, ttlSeconds = 300): Promise<void> {
  const cacheKey = `domain:${domain}`
  const data = JSON.stringify(config)

  try {
    // Try Redis first
    if (process.env.REDIS_URL || process.env.KV_REST_API_URL) {
      await setInRedis(cacheKey, data, ttlSeconds)
    }

    // Always set in memory cache as backup
    memoryCache.set(cacheKey, {
      data: config,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000,
    })
  } catch (error) {
    console.warn("Cache set failed, continuing without cache:", error)
  }
}

/**
 * Clear cached domain configuration
 */
export async function clearCachedDomainConfig(domain: string): Promise<void> {
  const cacheKey = `domain:${domain}`

  try {
    // Clear from Redis
    if (process.env.REDIS_URL || process.env.KV_REST_API_URL) {
      await deleteFromRedis(cacheKey)
    }

    // Clear from memory cache
    memoryCache.delete(cacheKey)
  } catch (error) {
    console.warn("Cache clear failed:", error)
  }
}

/**
 * Redis operations with error handling
 */
async function getFromRedis(key: string): Promise<string | null> {
  try {
    // Use Upstash Redis if available
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      const response = await fetch(`${process.env.KV_REST_API_URL}/get/${key}`, {
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        return data.result
      }
    }

    return null
  } catch (error) {
    console.warn("Redis GET failed:", error)
    return null
  }
}

async function setInRedis(key: string, value: string, ttl: number): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await fetch(`${process.env.KV_REST_API_URL}/set/${key}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value, ex: ttl }),
      })
    }
  } catch (error) {
    console.warn("Redis SET failed:", error)
  }
}

async function deleteFromRedis(key: string): Promise<void> {
  try {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      await fetch(`${process.env.KV_REST_API_URL}/del/${key}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`,
        },
      })
    }
  } catch (error) {
    console.warn("Redis DELETE failed:", error)
  }
}

/**
 * Check if memory cache entry is expired
 */
function isCacheExpired(entry: CacheEntry<any>): boolean {
  return Date.now() - entry.timestamp > entry.ttl
}

/**
 * Clear expired entries from memory cache
 */
export function cleanupMemoryCache(): void {
  for (const [key, entry] of memoryCache.entries()) {
    if (isCacheExpired(entry)) {
      memoryCache.delete(key)
    }
  }
}

// Cleanup memory cache every 5 minutes
if (typeof window === "undefined") {
  // Server-side only
  setInterval(cleanupMemoryCache, 5 * 60 * 1000)
}
