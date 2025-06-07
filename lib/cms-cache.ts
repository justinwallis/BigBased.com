import { createClient } from "@/lib/supabase/server"

// Simple in-memory cache for development (use Redis in production)
class MemoryCache {
  private cache = new Map<string, { data: any; expires: number }>()

  set(key: string, data: any, ttlSeconds = 300) {
    this.cache.set(key, {
      data,
      expires: Date.now() + ttlSeconds * 1000,
    })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expires) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }

  invalidatePattern(pattern: string) {
    const regex = new RegExp(pattern.replace(/\*/g, ".*"))
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key)
      }
    }
  }
}

const cache = new MemoryCache()

export class CMSCache {
  private static generateKey(prefix: string, ...parts: (string | number)[]): string {
    return `cms:${prefix}:${parts.join(":")}`
  }

  // Content caching
  static async getContent(id: string) {
    const key = this.generateKey("content", id)
    let content = cache.get(key)

    if (!content) {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("content_items")
        .select(`
          *,
          content_types(*)
        `)
        .eq("id", id)
        .single()

      if (!error && data) {
        content = data
        cache.set(key, content, 300) // 5 minutes
      }
    }

    return content
  }

  static async getContentList(filters: Record<string, any> = {}) {
    const filterKey = JSON.stringify(filters)
    const key = this.generateKey("content_list", Buffer.from(filterKey).toString("base64"))
    let content = cache.get(key)

    if (!content) {
      const supabase = createClient()
      let query = supabase
        .from("content_items")
        .select(`
          *,
          content_types(name, slug)
        `)
        .order("updated_at", { ascending: false })

      // Apply filters
      if (filters.status) {
        query = query.eq("status", filters.status)
      }
      if (filters.content_type) {
        query = query.eq("content_type_id", filters.content_type)
      }
      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (!error && data) {
        content = data
        cache.set(key, content, 180) // 3 minutes
      }
    }

    return content
  }

  // Media caching
  static async getMediaFile(id: string) {
    const key = this.generateKey("media", id)
    let media = cache.get(key)

    if (!media) {
      const supabase = createClient()
      const { data, error } = await supabase.from("media_files").select("*").eq("id", id).single()

      if (!error && data) {
        media = data
        cache.set(key, media, 600) // 10 minutes
      }
    }

    return media
  }

  // Content types caching
  static async getContentTypes() {
    const key = this.generateKey("content_types", "all")
    let types = cache.get(key)

    if (!types) {
      const supabase = createClient()
      const { data, error } = await supabase.from("content_types").select("*").order("name")

      if (!error && data) {
        types = data
        cache.set(key, types, 900) // 15 minutes
      }
    }

    return types
  }

  // Cache invalidation
  static invalidateContent(id?: string) {
    if (id) {
      cache.delete(this.generateKey("content", id))
    }
    cache.invalidatePattern("cms:content_list:*")
  }

  static invalidateMedia(id?: string) {
    if (id) {
      cache.delete(this.generateKey("media", id))
    }
    cache.invalidatePattern("cms:media_list:*")
  }

  static invalidateContentTypes() {
    cache.invalidatePattern("cms:content_types:*")
  }

  static clearAll() {
    cache.clear()
  }

  // Preload commonly accessed content
  static async preloadPopularContent() {
    const supabase = createClient()

    // Preload published content
    const { data: publishedContent } = await supabase
      .from("content_items")
      .select("id")
      .eq("status", "published")
      .limit(50)

    if (publishedContent) {
      for (const item of publishedContent) {
        await this.getContent(item.id)
      }
    }

    // Preload content types
    await this.getContentTypes()
  }

  // Cache warming for specific content
  static async warmCache(contentIds: string[]) {
    const promises = contentIds.map((id) => this.getContent(id))
    await Promise.all(promises)
  }

  // Cache statistics
  static getStats() {
    return {
      size: cache.cache.size,
      keys: Array.from(cache.cache.keys()),
    }
  }
}

// Cache middleware for API routes
export function withCache<T extends (...args: any[]) => Promise<any>>(cacheKey: string, ttlSeconds = 300, fn: T): T {
  return (async (...args: Parameters<T>) => {
    const key = `api:${cacheKey}:${JSON.stringify(args)}`
    let result = cache.get(key)

    if (!result) {
      result = await fn(...args)
      cache.set(key, result, ttlSeconds)
    }

    return result
  }) as T
}
