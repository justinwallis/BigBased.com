import { createClient } from "@/lib/supabase/server"
import { cacheGet, cacheSet } from "@/lib/redis"

// Cache TTL
const CACHE_TTL = 5 * 60 // 5 minutes

export interface CustomBranding {
  siteName?: string
  tagline?: string
  logo?: string
  favicon?: string
  colors?: {
    primary?: string
    secondary?: string
    accent?: string
  }
  fonts?: {
    heading?: string
    body?: string
  }
  metaTags?: {
    title?: string
    description?: string
    ogImage?: string
  }
}

export interface DomainConfig {
  id: number
  domain: string
  siteType: "bigbased" | "basedbook" | "custom"
  isActive: boolean
  customBranding: CustomBranding
  ownerUserId?: string
  ownerEmail?: string
  ownerName?: string
  registrationDate?: string
  expirationDate?: string
  notes?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export async function getDomainConfig(hostname: string): Promise<DomainConfig> {
  // Remove www and normalize
  const domain = hostname.replace(/^www\./, "").toLowerCase()

  // Check cache first
  const cacheKey = `domain:${domain}`
  const cached = await cacheGet<DomainConfig>(cacheKey)
  if (cached) {
    return cached
  }

  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from("domains")
      .select("*")
      .eq("domain", domain)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      // Fallback to default config
      const defaultConfig = getDefaultConfig(domain)

      // Cache the default config too
      await cacheSet(cacheKey, defaultConfig, CACHE_TTL)

      return defaultConfig
    }

    const config: DomainConfig = {
      id: data.id,
      domain: data.domain,
      siteType: data.site_type,
      isActive: data.is_active,
      customBranding: data.custom_branding || {},
      ownerUserId: data.owner_user_id,
      ownerEmail: data.owner_email,
      ownerName: data.owner_name,
      registrationDate: data.registration_date,
      expirationDate: data.expiration_date,
      notes: data.notes,
      tags: data.tags,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    // Cache the result
    await cacheSet(cacheKey, config, CACHE_TTL)

    return config
  } catch (error) {
    console.error("Error fetching domain config:", error)
    const defaultConfig = getDefaultConfig(domain)

    // Cache the default config too
    await cacheSet(cacheKey, defaultConfig, CACHE_TTL)

    return defaultConfig
  }
}

function getDefaultConfig(domain: string): DomainConfig {
  // Default fallback logic
  if (domain.includes("basedbook")) {
    return {
      id: 0, // Default ID for fallback
      domain,
      siteType: "basedbook",
      isActive: true,
      customBranding: {
        siteName: "BasedBook",
        tagline: "Your Conservative Digital Library",
        logo: "/basedbook-logo.png",
        favicon: "/basedbook-favicon.ico",
        colors: {
          primary: "#7c3aed",
          secondary: "#a855f7",
          accent: "#ec4899",
        },
        metaTags: {
          title: "BasedBook - Conservative Digital Library",
          description:
            "BasedBook is your premier destination for conservative literature, educational resources, and community-driven content.",
          ogImage: "/BasedBookPreview.png",
        },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  }

  // Default to BigBased
  return {
    id: 0, // Default ID for fallback
    domain,
    siteType: "bigbased",
    isActive: true,
    customBranding: {
      siteName: "Big Based",
      tagline: "Answer to Madness",
      logo: "/bb-logo.png",
      favicon: "/favicon.ico",
      colors: {
        primary: "#1f2937",
        secondary: "#3b82f6",
        accent: "#ef4444",
      },
      metaTags: {
        title: "Big Based - Answer to Madness",
        description:
          "Big Based isn't just a platform, it's a cultural revolution. At its core lies a living library of truth, faith, and insight.",
        ogImage: "/BigBasedPreview.png",
      },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

// Helper to get current domain config
export async function getCurrentDomainConfig(): Promise<DomainConfig> {
  if (typeof window !== "undefined") {
    return getDomainConfig(window.location.hostname)
  }

  // Server-side: get from headers or env
  const domain = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_DOMAIN || "bigbased.com"
  return getDomainConfig(domain)
}

// Track domain analytics
export async function trackDomainVisit(domainId: number, isSignup = false, isLogin = false) {
  try {
    const supabase = createClient()
    const today = new Date().toISOString().split("T")[0]

    // Check if we have an entry for today
    const { data: existingData } = await supabase
      .from("domain_analytics")
      .select("*")
      .eq("domain_id", domainId)
      .eq("date", today)
      .single()

    if (existingData) {
      // Update existing record
      await supabase
        .from("domain_analytics")
        .update({
          visits: existingData.visits + 1,
          page_views: existingData.page_views + 1,
          signups: existingData.signups + (isSignup ? 1 : 0),
          logins: existingData.logins + (isLogin ? 1 : 0),
        })
        .eq("id", existingData.id)
    } else {
      // Create new record
      await supabase.from("domain_analytics").insert({
        domain_id: domainId,
        date: today,
        visits: 1,
        unique_visitors: 1,
        page_views: 1,
        signups: isSignup ? 1 : 0,
        logins: isLogin ? 1 : 0,
      })
    }
  } catch (error) {
    console.error("Error tracking domain visit:", error)
  }
}
