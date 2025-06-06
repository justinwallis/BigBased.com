"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

// Types for domain management
export interface Domain {
  id: string
  domain: string
  is_active: boolean
  created_at: string
  updated_at: string
  owner_id: string | null
  settings: DomainSettings
}

export interface DomainSettings {
  theme?: string
  logo_url?: string
  favicon_url?: string
  primary_color?: string
  secondary_color?: string
  custom_css?: string
  features?: {
    enhanced_domains?: boolean
    custom_branding?: boolean
    analytics?: boolean
  }
}

// Get all domains
export async function getAllDomains() {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      return { success: false, error: "Not authorized" }
    }

    // Fetch domains
    const { data, error } = await supabase.from("domains").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching domains:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in getAllDomains:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Get a single domain
export async function getDomain(domainId: string) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      return { success: false, error: "Not authorized" }
    }

    // Fetch domain
    const { data, error } = await supabase.from("domains").select("*").eq("id", domainId).single()

    if (error) {
      console.error("Error fetching domain:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in getDomain:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Create a new domain
export async function createDomain(formData: FormData) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      return { success: false, error: "Not authorized" }
    }

    // Get form data
    const domain = formData.get("domain") as string
    const isActive = formData.get("is_active") === "true"

    // Basic validation
    if (!domain) {
      return { success: false, error: "Domain is required" }
    }

    // Default settings
    const settings = {
      features: {
        enhanced_domains: false,
        custom_branding: false,
        analytics: false,
      },
    }

    // Create domain
    const { data, error } = await supabase
      .from("domains")
      .insert([
        {
          domain,
          is_active: isActive,
          owner_id: null,
          settings,
        },
      ])
      .select()

    if (error) {
      console.error("Error creating domain:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/domains")
    return { success: true, data: data[0] }
  } catch (error: any) {
    console.error("Error in createDomain:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Update a domain
export async function updateDomain(domainId: string, formData: FormData) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      return { success: false, error: "Not authorized" }
    }

    // Get current domain data
    const { data: currentDomain, error: fetchError } = await supabase
      .from("domains")
      .select("*")
      .eq("id", domainId)
      .single()

    if (fetchError) {
      console.error("Error fetching domain for update:", fetchError)
      return { success: false, error: fetchError.message }
    }

    // Get form data
    const domain = formData.get("domain") as string
    const isActive = formData.get("is_active") === "true"

    // Get feature toggles
    const enhancedDomains = formData.get("enhanced_domains") === "true"
    const customBranding = formData.get("custom_branding") === "true"
    const analytics = formData.get("analytics") === "true"

    // Get branding settings
    const logoUrl = (formData.get("logo_url") as string) || currentDomain.settings?.logo_url
    const faviconUrl = (formData.get("favicon_url") as string) || currentDomain.settings?.favicon_url
    const primaryColor = (formData.get("primary_color") as string) || currentDomain.settings?.primary_color
    const secondaryColor = (formData.get("secondary_color") as string) || currentDomain.settings?.secondary_color
    const customCss = (formData.get("custom_css") as string) || currentDomain.settings?.custom_css

    // Prepare settings object
    const settings = {
      ...currentDomain.settings,
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      primary_color: primaryColor,
      secondary_color: secondaryColor,
      custom_css: customCss,
      features: {
        enhanced_domains: enhancedDomains,
        custom_branding: customBranding,
        analytics: analytics,
      },
    }

    // Update domain
    const { data, error } = await supabase
      .from("domains")
      .update({
        domain,
        is_active: isActive,
        settings,
      })
      .eq("id", domainId)
      .select()

    if (error) {
      console.error("Error updating domain:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/domains")
    revalidatePath(`/admin/domains/${domainId}`)
    return { success: true, data: data[0] }
  } catch (error: any) {
    console.error("Error in updateDomain:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Delete a domain
export async function deleteDomain(domainId: string) {
  try {
    const supabase = createClient()

    // Check if user is admin
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session) {
      return { success: false, error: "Not authenticated" }
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", session.user.id).single()

    if (profile?.role !== "admin") {
      return { success: false, error: "Not authorized" }
    }

    // Delete domain
    const { error } = await supabase.from("domains").delete().eq("id", domainId)

    if (error) {
      console.error("Error deleting domain:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/domains")
    return { success: true }
  } catch (error: any) {
    console.error("Error in deleteDomain:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
