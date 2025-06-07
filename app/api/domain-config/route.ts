import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { parseDomain, getDefaultDomainConfig } from "@/lib/domain-utils"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const domain = searchParams.get("domain")

    if (!domain) {
      return NextResponse.json({ error: "Domain parameter is required" }, { status: 400 })
    }

    const cleanDomain = parseDomain(domain)
    const supabase = createClient()

    // Fetch domain configuration from database
    const { data: domainData, error } = await supabase
      .from("domains")
      .select("*")
      .eq("domain", cleanDomain)
      .eq("is_active", true)
      .single()

    if (error || !domainData) {
      // Return default configuration if domain not found
      const defaultConfig = getDefaultDomainConfig(cleanDomain)
      return NextResponse.json(defaultConfig)
    }

    // Transform database data to domain config format
    const domainConfig = {
      id: domainData.id,
      domain: domainData.domain,
      siteType: domainData.site_type || "custom",
      isActive: domainData.is_active,
      customBranding: {
        logo_url: domainData.custom_branding?.logo_url,
        favicon_url: domainData.custom_branding?.favicon_url,
        primary_color: domainData.custom_branding?.primary_color,
        secondary_color: domainData.custom_branding?.secondary_color,
        custom_css: domainData.custom_branding?.custom_css,
        site_name: domainData.custom_branding?.site_name,
        tagline: domainData.custom_branding?.tagline,
        meta_description: domainData.custom_branding?.meta_description,
        features: {
          enhanced_domains: domainData.custom_branding?.features?.enhanced_domains || false,
          custom_branding: domainData.custom_branding?.features?.custom_branding || false,
          analytics: domainData.custom_branding?.features?.analytics || false,
          custom_navigation: domainData.custom_branding?.features?.custom_navigation || false,
          domain_specific_content: domainData.custom_branding?.features?.domain_specific_content || false,
          seo_optimization: domainData.custom_branding?.features?.seo_optimization || false,
        },
      },
      settings: domainData.custom_branding?.settings || {},
      analytics: domainData.custom_branding?.analytics || {},
      social: domainData.custom_branding?.social || {},
      content: domainData.custom_branding?.content || {},
    }

    return NextResponse.json(domainConfig)
  } catch (error: any) {
    console.error("Error fetching domain config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { domain, updates } = body

    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 })
    }

    const cleanDomain = parseDomain(domain)
    const supabase = createClient()

    // Check if user is authenticated and has permission
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    // For now, allow any authenticated user to update domain config
    // In production, you might want to check if user owns the domain

    // Get current domain data
    const { data: currentDomain, error: fetchError } = await supabase
      .from("domains")
      .select("*")
      .eq("domain", cleanDomain)
      .single()

    if (fetchError) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 })
    }

    // Merge updates with existing custom_branding
    const updatedCustomBranding = {
      ...currentDomain.custom_branding,
      ...updates.customBranding,
      features: {
        ...currentDomain.custom_branding?.features,
        ...updates.customBranding?.features,
      },
      settings: {
        ...currentDomain.custom_branding?.settings,
        ...updates.settings,
      },
      analytics: {
        ...currentDomain.custom_branding?.analytics,
        ...updates.analytics,
      },
      social: {
        ...currentDomain.custom_branding?.social,
        ...updates.social,
      },
      content: {
        ...currentDomain.custom_branding?.content,
        ...updates.content,
      },
    }

    // Update domain in database
    const { data: updatedDomain, error: updateError } = await supabase
      .from("domains")
      .update({
        custom_branding: updatedCustomBranding,
        is_active: updates.isActive !== undefined ? updates.isActive : currentDomain.is_active,
      })
      .eq("domain", cleanDomain)
      .select()
      .single()

    if (updateError) {
      console.error("Error updating domain:", updateError)
      return NextResponse.json({ error: "Failed to update domain" }, { status: 500 })
    }

    // Return updated config in the same format as GET
    const domainConfig = {
      id: updatedDomain.id,
      domain: updatedDomain.domain,
      siteType: updatedDomain.site_type || "custom",
      isActive: updatedDomain.is_active,
      customBranding: {
        logo_url: updatedDomain.custom_branding?.logo_url,
        favicon_url: updatedDomain.custom_branding?.favicon_url,
        primary_color: updatedDomain.custom_branding?.primary_color,
        secondary_color: updatedDomain.custom_branding?.secondary_color,
        custom_css: updatedDomain.custom_branding?.custom_css,
        site_name: updatedDomain.custom_branding?.site_name,
        tagline: updatedDomain.custom_branding?.tagline,
        meta_description: updatedDomain.custom_branding?.meta_description,
        features: updatedDomain.custom_branding?.features || {},
      },
      settings: updatedDomain.custom_branding?.settings || {},
      analytics: updatedDomain.custom_branding?.analytics || {},
      social: updatedDomain.custom_branding?.social || {},
      content: updatedDomain.custom_branding?.content || {},
    }

    return NextResponse.json(domainConfig)
  } catch (error: any) {
    console.error("Error updating domain config:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
