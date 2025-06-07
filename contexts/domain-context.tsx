"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export interface DomainConfig {
  id: string
  domain: string
  siteType: "bigbased" | "basedbook" | "custom"
  isActive: boolean
  customBranding: {
    logo_url?: string
    favicon_url?: string
    primary_color?: string
    secondary_color?: string
    custom_css?: string
    site_name?: string
    tagline?: string
    meta_description?: string
    features: {
      enhanced_domains: boolean
      custom_branding: boolean
      analytics: boolean
      custom_navigation: boolean
      domain_specific_content: boolean
      seo_optimization: boolean
    }
  }
  settings: {
    theme?: "light" | "dark" | "auto"
    language?: string
    timezone?: string
    currency?: string
    date_format?: string
    enable_comments?: boolean
    enable_social_sharing?: boolean
    enable_newsletter?: boolean
    enable_search?: boolean
    maintenance_mode?: boolean
    custom_footer?: string
    custom_header?: string
    redirect_rules?: Array<{ from: string; to: string; type: "301" | "302" }>
  }
  analytics?: {
    google_analytics_id?: string
    facebook_pixel_id?: string
    custom_tracking_code?: string
    enable_heatmaps?: boolean
    enable_session_recording?: boolean
  }
  social?: {
    facebook_url?: string
    twitter_url?: string
    instagram_url?: string
    linkedin_url?: string
    youtube_url?: string
    custom_social_links?: Array<{ name: string; url: string; icon?: string }>
  }
  content?: {
    homepage_layout?: "default" | "landing" | "blog" | "portfolio" | "custom"
    featured_content?: string[]
    custom_pages?: Array<{ slug: string; title: string; content: string }>
    navigation_menu?: Array<{ label: string; url: string; external?: boolean }>
  }
}

interface DomainContextType {
  domainConfig: DomainConfig | null
  isLoading: boolean
  error: string | null
  refreshConfig: () => Promise<void>
  updateConfig: (updates: Partial<DomainConfig>) => Promise<void>
}

const DomainContext = createContext<DomainContextType | undefined>(undefined)

export function DomainProvider({ children }: { children: React.ReactNode }) {
  const [domainConfig, setDomainConfig] = useState<DomainConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const getCurrentDomain = () => {
    if (typeof window !== "undefined") {
      return window.location.hostname
    }
    return "bigbased.com" // fallback
  }

  const fetchDomainConfig = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const currentDomain = getCurrentDomain()
      const response = await fetch(`/api/domain-config?domain=${currentDomain}`)

      if (!response.ok) {
        throw new Error("Failed to fetch domain configuration")
      }

      const config = await response.json()
      setDomainConfig(config)
    } catch (err: any) {
      console.error("Error fetching domain config:", err)
      setError(err.message)

      // Set default config as fallback
      const currentDomain = getCurrentDomain()
      setDomainConfig({
        id: "default",
        domain: currentDomain,
        siteType: currentDomain.includes("basedbook") ? "basedbook" : "bigbased",
        isActive: true,
        customBranding: {
          features: {
            enhanced_domains: false,
            custom_branding: false,
            analytics: false,
            custom_navigation: false,
            domain_specific_content: false,
            seo_optimization: false,
          },
        },
        settings: {},
      })
    } finally {
      setIsLoading(false)
    }
  }

  const refreshConfig = async () => {
    await fetchDomainConfig()
  }

  const updateConfig = async (updates: Partial<DomainConfig>) => {
    try {
      const response = await fetch("/api/domain-config", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: getCurrentDomain(),
          updates,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update domain configuration")
      }

      const updatedConfig = await response.json()
      setDomainConfig(updatedConfig)
    } catch (err: any) {
      console.error("Error updating domain config:", err)
      setError(err.message)
    }
  }

  useEffect(() => {
    fetchDomainConfig()
  }, [])

  // Apply custom CSS if available
  useEffect(() => {
    if (domainConfig?.customBranding?.custom_css) {
      const styleElement = document.createElement("style")
      styleElement.id = "domain-custom-css"
      styleElement.textContent = domainConfig.customBranding.custom_css

      // Remove existing custom CSS
      const existingStyle = document.getElementById("domain-custom-css")
      if (existingStyle) {
        existingStyle.remove()
      }

      document.head.appendChild(styleElement)

      return () => {
        const element = document.getElementById("domain-custom-css")
        if (element) {
          element.remove()
        }
      }
    }
  }, [domainConfig?.customBranding?.custom_css])

  // Apply custom colors as CSS variables
  useEffect(() => {
    if (domainConfig?.customBranding) {
      const root = document.documentElement
      const { primary_color, secondary_color } = domainConfig.customBranding

      if (primary_color) {
        root.style.setProperty("--domain-primary-color", primary_color)
      }
      if (secondary_color) {
        root.style.setProperty("--domain-secondary-color", secondary_color)
      }
    }
  }, [domainConfig?.customBranding])

  return (
    <DomainContext.Provider
      value={{
        domainConfig,
        isLoading,
        error,
        refreshConfig,
        updateConfig,
      }}
    >
      {children}
    </DomainContext.Provider>
  )
}

export function useDomain() {
  const context = useContext(DomainContext)
  if (context === undefined) {
    throw new Error("useDomain must be used within a DomainProvider")
  }
  return context
}

// Helper hooks for specific domain features
export function useDomainBranding() {
  const { domainConfig } = useDomain()
  return domainConfig?.customBranding || null
}

export function useDomainSettings() {
  const { domainConfig } = useDomain()
  return domainConfig?.settings || {}
}

export function useDomainAnalytics() {
  const { domainConfig } = useDomain()
  return domainConfig?.analytics || null
}

export function useDomainSocial() {
  const { domainConfig } = useDomain()
  return domainConfig?.social || null
}

export function useDomainContent() {
  const { domainConfig } = useDomain()
  return domainConfig?.content || null
}
