"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { cacheDelete } from "@/lib/redis"
import type { CustomBranding } from "@/lib/domain-config"

export async function addDomain(
  domain: string,
  siteType: "bigbased" | "basedbook" | "custom" = "bigbased",
  ownerEmail?: string,
  ownerName?: string,
) {
  try {
    const supabase = createClient()

    // Normalize domain
    const normalizedDomain = domain
      .replace(/^https?:\/\//, "")
      .replace(/^www\./, "")
      .toLowerCase()

    const { data, error } = await supabase
      .from("domains")
      .insert({
        domain: normalizedDomain,
        site_type: siteType,
        is_active: true,
        owner_email: ownerEmail,
        owner_name: ownerName,
        registration_date: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Clear cache for this domain
    await cacheDelete(`domain:${normalizedDomain}`)

    revalidatePath("/admin/domains")
    return { success: true, data }
  } catch (error) {
    console.error("Error adding domain:", error)
    return { success: false, error: error.message }
  }
}

export async function bulkAddDomains(
  domains: Array<{
    domain: string
    siteType?: "bigbased" | "basedbook" | "custom"
    ownerEmail?: string
    ownerName?: string
  }>,
) {
  try {
    const supabase = createClient()

    const domainData = domains.map((item) => ({
      domain: item.domain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .toLowerCase(),
      site_type: item.siteType || "bigbased",
      is_active: true,
      owner_email: item.ownerEmail,
      owner_name: item.ownerName,
      registration_date: new Date().toISOString(),
    }))

    const { data, error } = await supabase.from("domains").insert(domainData).select()

    if (error) {
      throw error
    }

    // Clear cache for all these domains
    for (const item of domains) {
      const normalizedDomain = item.domain
        .replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .toLowerCase()
      await cacheDelete(`domain:${normalizedDomain}`)
    }

    revalidatePath("/admin/domains")
    return { success: true, data, count: data.length }
  } catch (error) {
    console.error("Error bulk adding domains:", error)
    return { success: false, error: error.message }
  }
}

export async function toggleDomainStatus(domainId: number, isActive: boolean) {
  try {
    const supabase = createClient()

    // First get the domain to clear cache
    const { data: domainData } = await supabase.from("domains").select("domain").eq("id", domainId).single()

    const { data, error } = await supabase
      .from("domains")
      .update({ is_active: isActive, updated_at: new Date().toISOString() })
      .eq("id", domainId)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Clear cache for this domain
    if (domainData) {
      await cacheDelete(`domain:${domainData.domain}`)
    }

    revalidatePath("/admin/domains")
    return { success: true, data }
  } catch (error) {
    console.error("Error toggling domain status:", error)
    return { success: false, error: error.message }
  }
}

export async function updateDomainBranding(domainId: number, branding: CustomBranding) {
  try {
    const supabase = createClient()

    // First get the domain to clear cache
    const { data: domainData } = await supabase.from("domains").select("domain").eq("id", domainId).single()

    const { data, error } = await supabase
      .from("domains")
      .update({
        custom_branding: branding,
        updated_at: new Date().toISOString(),
      })
      .eq("id", domainId)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Clear cache for this domain
    if (domainData) {
      await cacheDelete(`domain:${domainData.domain}`)
    }

    revalidatePath("/admin/domains")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating domain branding:", error)
    return { success: false, error: error.message }
  }
}

export async function updateDomainOwner(
  domainId: number,
  ownerData: {
    ownerUserId?: string
    ownerEmail?: string
    ownerName?: string
    notes?: string
    tags?: string[]
  },
) {
  try {
    const supabase = createClient()

    // First get the domain to clear cache
    const { data: domainData } = await supabase.from("domains").select("domain").eq("id", domainId).single()

    const { data, error } = await supabase
      .from("domains")
      .update({
        owner_user_id: ownerData.ownerUserId,
        owner_email: ownerData.ownerEmail,
        owner_name: ownerData.ownerName,
        notes: ownerData.notes,
        tags: ownerData.tags,
        updated_at: new Date().toISOString(),
      })
      .eq("id", domainId)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Clear cache for this domain
    if (domainData) {
      await cacheDelete(`domain:${domainData.domain}`)
    }

    revalidatePath("/admin/domains")
    return { success: true, data }
  } catch (error) {
    console.error("Error updating domain owner:", error)
    return { success: false, error: error.message }
  }
}

export async function getDomainAnalytics(domainId: number, startDate: string, endDate: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("domain_analytics")
      .select("*")
      .eq("domain_id", domainId)
      .gte("date", startDate)
      .lte("date", endDate)
      .order("date", { ascending: true })

    if (error) {
      throw error
    }

    return { success: true, data }
  } catch (error) {
    console.error("Error fetching domain analytics:", error)
    return { success: false, error: error.message }
  }
}

export async function deleteDomain(domainId: number) {
  try {
    const supabase = createClient()

    // First get the domain to clear cache
    const { data: domainData } = await supabase.from("domains").select("domain").eq("id", domainId).single()

    const { error } = await supabase.from("domains").delete().eq("id", domainId)

    if (error) {
      throw error
    }

    // Clear cache for this domain
    if (domainData) {
      await cacheDelete(`domain:${domainData.domain}`)
    }

    revalidatePath("/admin/domains")
    return { success: true }
  } catch (error) {
    console.error("Error deleting domain:", error)
    return { success: false, error: error.message }
  }
}
