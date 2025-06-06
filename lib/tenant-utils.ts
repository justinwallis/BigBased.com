/**
 * Tenant context utilities for multi-tenant functionality
 * Safe utilities that enhance but don't break existing functionality
 */

import { type DomainConfig, parseDomain, getDefaultDomainConfig, isEnhancedDomainsEnabled } from "./domain-utils"
import { getCachedDomainConfig, setCachedDomainConfig } from "./cache-utils"

/**
 * Get domain configuration from database or cache
 * Always returns a valid config, never throws
 */
export async function getDomainConfig(hostname: string): Promise<DomainConfig> {
  const domain = parseDomain(hostname)

  // If enhanced domains are disabled, return default config
  if (!isEnhancedDomainsEnabled()) {
    return getDefaultDomainConfig(domain)
  }

  try {
    // Try cache first
    const cached = await getCachedDomainConfig(domain)
    if (cached) {
      return cached
    }

    // Query database
    const config = await queryDomainFromDatabase(domain)

    // Cache the result
    if (config) {
      await setCachedDomainConfig(domain, config)
      return config
    }

    // Return default if not found
    return getDefaultDomainConfig(domain)
  } catch (error) {
    console.warn(`Failed to get domain config for ${domain}:`, error)
    return getDefaultDomainConfig(domain)
  }
}

/**
 * Query domain configuration from database
 * Safe database query with error handling
 */
async function queryDomainFromDatabase(domain: string): Promise<DomainConfig | null> {
  try {
    // Import Supabase client safely
    const { createClient } = await import("@/lib/supabase/server")
    const supabase = createClient()

    // Query domain with settings
    const { data: domainData, error: domainError } = await supabase
      .from("domains")
      .select(`
        id,
        domain,
        site_type,
        is_active,
        custom_branding,
        owner_user_id,
        domain_settings (
          setting_key,
          setting_value
        )
      `)
      .eq("domain", domain)
      .eq("is_active", true)
      .single()

    if (domainError || !domainData) {
      return null
    }

    // Transform settings array to object
    const settings: Record<string, any> = {}
    if (domainData.domain_settings) {
      for (const setting of domainData.domain_settings) {
        settings[setting.setting_key] = setting.setting_value
      }
    }

    return {
      id: domainData.id,
      domain: domainData.domain,
      siteType: domainData.site_type,
      isActive: domainData.is_active,
      customBranding: domainData.custom_branding || {},
      ownerUserId: domainData.owner_user_id,
      settings,
    }
  } catch (error) {
    console.warn("Database query failed:", error)
    return null
  }
}

/**
 * Track domain visit for analytics
 * Fire-and-forget function that won't break the app if it fails
 */
export async function trackDomainVisit(domainId: number): Promise<void> {
  if (!isEnhancedDomainsEnabled() || domainId <= 0) {
    return
  }

  try {
    // Use fetch to avoid blocking the response
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domainId, type: "visit" }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the app
    })
  } catch (error) {
    // Silently fail - analytics shouldn't break the app
  }
}

/**
 * Get tenant-specific navigation items
 * Returns appropriate navigation based on site type
 */
export function getTenantNavigation(domainConfig: DomainConfig) {
  const { siteType } = domainConfig

  const baseNavigation = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ]

  if (siteType === "bigbased") {
    return [
      ...baseNavigation,
      { href: "/features", label: "Features" },
      { href: "/revolution", label: "Revolution" },
      { href: "/transform", label: "Transform" },
      { href: "/partners", label: "Partners" },
    ]
  }

  if (siteType === "basedbook") {
    return [
      ...baseNavigation,
      { href: "/library", label: "Library" },
      { href: "/authors", label: "Authors" },
      { href: "/collections", label: "Collections" },
    ]
  }

  // Custom domains get basic navigation
  return baseNavigation
}

/**
 * Check if current domain allows a specific route
 */
export function isRouteAllowed(domainConfig: DomainConfig, pathname: string): boolean {
  const { siteType } = domainConfig

  // BigBased exclusive routes
  const bigBasedRoutes = ["/features", "/revolution", "/transform", "/partners"]

  // BasedBook exclusive routes
  const basedBookRoutes = ["/library", "/authors", "/collections"]

  // Check restrictions
  if (siteType === "basedbook" && bigBasedRoutes.some((route) => pathname.startsWith(route))) {
    return false
  }

  if (siteType === "bigbased" && basedBookRoutes.some((route) => pathname.startsWith(route))) {
    return false
  }

  if (siteType === "custom" && basedBookRoutes.some((route) => pathname.startsWith(route))) {
    return false
  }

  return true
}
