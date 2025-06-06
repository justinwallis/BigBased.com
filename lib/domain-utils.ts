/**
 * Domain utilities for multi-tenant functionality
 * These functions are safe and don't modify existing behavior
 */

export interface DomainConfig {
  id: number
  domain: string
  siteType: "bigbased" | "basedbook" | "custom"
  isActive: boolean
  customBranding: Record<string, any>
  ownerUserId?: string
  settings: Record<string, any>
}

/**
 * Parse and normalize domain from hostname
 * Handles www prefixes, ports, and subdomains safely
 */
export function parseDomain(hostname: string): string {
  if (!hostname) return "bigbased.com" // Safe fallback

  // Remove port if present
  const domain = hostname.split(":")[0]

  // Remove www prefix
  const cleanDomain = domain.replace(/^www\./, "")

  // Validate domain format
  if (!isValidDomain(cleanDomain)) {
    return "bigbased.com" // Safe fallback
  }

  return cleanDomain.toLowerCase()
}

/**
 * Validate domain format
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9](?:\.[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9])*$/
  return domainRegex.test(domain) && domain.length <= 253
}

/**
 * Determine site type from domain
 * Safe function with fallbacks
 */
export function getSiteTypeFromDomain(domain: string): "bigbased" | "basedbook" | "custom" {
  const cleanDomain = parseDomain(domain)

  if (cleanDomain.includes("basedbook")) {
    return "basedbook"
  }

  if (cleanDomain.includes("bigbased")) {
    return "bigbased"
  }

  // For custom domains, default to bigbased functionality
  return "custom"
}

/**
 * Check if enhanced domain features are enabled
 */
export function isEnhancedDomainsEnabled(): boolean {
  const isEnabled = process.env.NEXT_PUBLIC_ENHANCED_DOMAINS === "true"
  const isDisabled = process.env.NEXT_PUBLIC_DISABLE_ENHANCED_DOMAINS === "true"

  return isEnabled && !isDisabled
}

/**
 * Get default domain configuration
 * Used as fallback when domain lookup fails
 */
export function getDefaultDomainConfig(domain: string): DomainConfig {
  return {
    id: 0,
    domain: parseDomain(domain),
    siteType: getSiteTypeFromDomain(domain),
    isActive: true,
    customBranding: {},
    settings: {},
  }
}

/**
 * Check if a domain should show specific features
 */
export function shouldShowFeature(domainConfig: DomainConfig, feature: string): boolean {
  // Always allow features on main domains
  if (domainConfig.domain === "bigbased.com" || domainConfig.domain === "basedbook.com") {
    return true
  }

  // Check if feature is enabled in domain settings
  const enabledFeatures = domainConfig.settings.enabled_features || []
  return enabledFeatures.includes(feature)
}
