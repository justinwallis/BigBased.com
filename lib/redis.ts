import { Redis } from "@upstash/redis"

// Create Redis client
let redis: Redis | null = null

export function getRedisClient() {
  if (!redis) {
    // Initialize Redis client
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || "",
      token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
    })
  }
  return redis
}

// Fallback to in-memory cache if Redis is not available
const memoryCache = new Map<string, { value: any; expiry: number }>()

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    // Try Redis first
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const redis = getRedisClient()
      const value = await redis.get<T>(key)
      return value
    }

    // Fallback to memory cache
    const item = memoryCache.get(key)
    if (item && item.expiry > Date.now()) {
      return item.value as T
    }

    return null
  } catch (error) {
    console.error("Cache get error:", error)
    return null
  }
}

export async function cacheSet<T>(key: string, value: T, ttlSeconds = 300): Promise<void> {
  try {
    // Try Redis first
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const redis = getRedisClient()
      await redis.set(key, value, { ex: ttlSeconds })
      return
    }

    // Fallback to memory cache
    memoryCache.set(key, {
      value,
      expiry: Date.now() + ttlSeconds * 1000,
    })
  } catch (error) {
    console.error("Cache set error:", error)
  }
}

export async function cacheDelete(key: string): Promise<void> {
  try {
    // Try Redis first
    if (process.env.UPSTASH_REDIS_REST_URL) {
      const redis = getRedisClient()
      await redis.del(key)
      return
    }

    // Fallback to memory cache
    memoryCache.delete(key)
  } catch (error) {
    console.error("Cache delete error:", error)
  }
}
