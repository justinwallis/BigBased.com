import { getDomainConfig, type DomainConfig } from "./domain-config"

// Dynamic site configuration based on domain
export class SiteConfig {
  private domainConfig: DomainConfig | null = null

  async initialize(hostname?: string): Promise<void> {
    if (hostname) {
      this.domainConfig = await getDomainConfig(hostname)
    } else if (typeof window !== "undefined") {
      this.domainConfig = await getDomainConfig(window.location.hostname)
    } else {
      // Server-side fallback
      const domain = process.env.VERCEL_URL || process.env.NEXT_PUBLIC_DOMAIN || "bigbased.com"
      this.domainConfig = await getDomainConfig(domain)
    }
  }

  get isBigBased(): boolean {
    return this.domainConfig?.siteType === "bigbased"
  }

  get isBasedBook(): boolean {
    return this.domainConfig?.siteType === "basedbook"
  }

  get isCustomDomain(): boolean {
    return this.domainConfig?.siteType === "custom"
  }

  get siteName(): string {
    return this.domainConfig?.customBranding?.siteName || (this.isBigBased ? "Big Based" : "BasedBook")
  }

  get logo(): string {
    return this.domainConfig?.customBranding?.logo || (this.isBigBased ? "/bb-logo.png" : "/basedbook-logo.png")
  }

  get colors() {
    return (
      this.domainConfig?.customBranding?.colors ||
      (this.isBigBased
        ? {
            primary: "#1f2937",
            secondary: "#3b82f6",
            accent: "#ef4444",
          }
        : {
            primary: "#7c3aed",
            secondary: "#a855f7",
            accent: "#ec4899",
          })
    )
  }

  get features() {
    const siteType = this.domainConfig?.siteType || "bigbased"

    return {
      enableBilling: siteType === "bigbased",
      enableBookReader: siteType === "bigbased",
      enableVoting: siteType === "bigbased",
      enablePrayerFeed: siteType === "bigbased",
      enableRevolution: siteType === "bigbased",

      enableLibraryBrowse: siteType === "basedbook",
      enableAuthorProfiles: siteType === "basedbook",
      enableCollections: siteType === "basedbook",

      // Shared features
      enableProfiles: true,
      enableAuth: true,
      enableSettings: true,
    }
  }

  get navigation() {
    const siteType = this.domainConfig?.siteType || "bigbased"

    if (siteType === "basedbook") {
      return [
        { name: "Library", href: "/library" },
        { name: "Authors", href: "/authors" },
        { name: "Collections", href: "/collections" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
      ]
    }

    // BigBased or custom domains default to BigBased nav
    return [
      { name: "About", href: "/about" },
      { name: "Features", href: "/features" },
      { name: "Revolution", href: "/revolution" },
      { name: "Transform", href: "/transform" },
      { name: "Books", href: "/books" },
      { name: "Voting", href: "/voting" },
      { name: "Partners", href: "/partners" },
      { name: "Contact", href: "/contact" },
    ]
  }
}

// Global instance
export const siteConfig = new SiteConfig()
