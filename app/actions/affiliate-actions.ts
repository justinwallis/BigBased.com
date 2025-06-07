"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { CMSErrorTracker } from "@/lib/sentry"

// Types for the affiliate system
export interface AffiliateProgram {
  id: string
  name: string
  slug: string
  description?: string
  program_type: string
  status: string
  default_commission_rate: number
  commission_type: string
  commission_structure: any
  cookie_duration: number
  min_payout_amount: number
  payout_frequency: string
  created_at: string
  updated_at: string
}

export interface Affiliate {
  id: string
  user_id: string
  affiliate_code: string
  program_id: string
  tier_level: number
  status: string
  verification_status: string
  total_referrals: number
  total_sales: number
  total_commissions: number
  total_paid_commissions: number
  pending_commissions: number
  conversion_rate: number
  quality_score: number
  joined_at: string
  last_active_at?: string
}

export interface AffiliateConversion {
  id: string
  affiliate_id: string
  program_id: string
  order_id?: string
  conversion_type: string
  conversion_value: number
  commission_rate: number
  commission_amount: number
  status: string
  converted_at: string
}

// Affiliate Program Management
export async function createAffiliateProgram(formData: FormData) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const name = formData.get("name") as string
    const slug = formData.get("slug") as string
    const description = formData.get("description") as string
    const program_type = formData.get("program_type") as string
    const default_commission_rate = Number.parseFloat(formData.get("default_commission_rate") as string)
    const commission_type = formData.get("commission_type") as string
    const cookie_duration = Number.parseInt(formData.get("cookie_duration") as string)
    const min_payout_amount = Number.parseFloat(formData.get("min_payout_amount") as string)
    const payout_frequency = formData.get("payout_frequency") as string

    const { data, error } = await supabase
      .from("affiliate_programs")
      .insert({
        name,
        slug,
        description,
        program_type,
        default_commission_rate,
        commission_type,
        cookie_duration,
        min_payout_amount,
        payout_frequency,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      CMSErrorTracker.trackContentError("create_affiliate_program", "new", new Error(error.message))
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/affiliate")
    return { success: true, data }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("create_affiliate_program", "new", error)
    return { success: false, error: error.message }
  }
}

export async function getAffiliatePrograms() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("affiliate_programs")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Affiliate Management
export async function createAffiliate(formData: FormData) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const program_id = formData.get("program_id") as string
    const affiliate_code = formData.get("affiliate_code") as string
    const business_name = formData.get("business_name") as string
    const website_url = formData.get("website_url") as string
    const payment_method = formData.get("payment_method") as string

    const { data, error } = await supabase
      .from("affiliates")
      .insert({
        user_id: user.id,
        program_id,
        affiliate_code,
        business_name,
        website_url,
        payment_method,
        status: "pending",
        verification_status: "unverified",
      })
      .select()
      .single()

    if (error) {
      CMSErrorTracker.trackContentError("create_affiliate", "new", new Error(error.message))
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/affiliate")
    return { success: true, data }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("create_affiliate", "new", error)
    return { success: false, error: error.message }
  }
}

export async function getAffiliates(programId?: string) {
  try {
    const supabase = createClient()

    let query = supabase
      .from("affiliates")
      .select(`
        *,
        affiliate_programs(name, slug),
        profiles(username, full_name, email)
      `)
      .order("joined_at", { ascending: false })

    if (programId) {
      query = query.eq("program_id", programId)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateAffiliateStatus(affiliateId: string, status: string, notes?: string) {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("affiliates")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", affiliateId)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Log the status change
    await supabase.from("affiliate_communications").insert({
      program_id: data.program_id,
      title: `Status Update: ${status}`,
      content: notes || `Your affiliate status has been updated to ${status}`,
      communication_type: "alert",
      target_audience: { affiliate_ids: [affiliateId] },
    })

    revalidatePath("/admin/affiliate")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Conversion Tracking
export async function recordConversion(conversionData: {
  affiliate_id: string
  program_id: string
  click_id?: string
  order_id?: string
  conversion_type: string
  conversion_value: number
  commission_rate: number
  product_id?: string
  product_name?: string
}) {
  try {
    const supabase = createClient()

    const commission_amount = conversionData.conversion_value * conversionData.commission_rate

    const { data, error } = await supabase
      .from("affiliate_conversions")
      .insert({
        ...conversionData,
        commission_amount,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      CMSErrorTracker.trackContentError("record_conversion", conversionData.affiliate_id, new Error(error.message))
      return { success: false, error: error.message }
    }

    // Update affiliate pending commissions
    await supabase
      .from("affiliates")
      .update({
        pending_commissions: supabase.raw(`pending_commissions + ${commission_amount}`),
        updated_at: new Date().toISOString(),
      })
      .eq("id", conversionData.affiliate_id)

    return { success: true, data }
  } catch (error: any) {
    CMSErrorTracker.trackContentError("record_conversion", conversionData.affiliate_id, error)
    return { success: false, error: error.message }
  }
}

export async function getAffiliateConversions(affiliateId?: string, programId?: string) {
  try {
    const supabase = createClient()

    let query = supabase
      .from("affiliate_conversions")
      .select(`
        *,
        affiliates(affiliate_code, business_name),
        affiliate_programs(name)
      `)
      .order("converted_at", { ascending: false })

    if (affiliateId) {
      query = query.eq("affiliate_id", affiliateId)
    }

    if (programId) {
      query = query.eq("program_id", programId)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Analytics
export async function getAffiliateAnalytics(affiliateId?: string, dateRange?: { start: string; end: string }) {
  try {
    const supabase = createClient()

    let query = supabase.from("affiliate_analytics_daily").select("*").order("date", { ascending: false })

    if (affiliateId) {
      query = query.eq("affiliate_id", affiliateId)
    }

    if (dateRange) {
      query = query.gte("date", dateRange.start).lte("date", dateRange.end)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    // Calculate summary statistics
    const summary = data?.reduce(
      (acc, day) => ({
        total_clicks: acc.total_clicks + day.clicks,
        total_conversions: acc.total_conversions + day.conversions,
        total_commission: acc.total_commission + Number.parseFloat(day.commissions_earned || "0"),
        total_conversion_value: acc.total_conversion_value + Number.parseFloat(day.conversion_value || "0"),
      }),
      { total_clicks: 0, total_conversions: 0, total_commission: 0, total_conversion_value: 0 },
    )

    return { success: true, data, summary }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Payout Management
export async function createPayout(affiliateId: string, amount: number, paymentMethod: string) {
  try {
    const supabase = createClient()

    // Get affiliate details
    const { data: affiliate, error: affiliateError } = await supabase
      .from("affiliates")
      .select("*")
      .eq("id", affiliateId)
      .single()

    if (affiliateError || !affiliate) {
      return { success: false, error: "Affiliate not found" }
    }

    // Create payout record
    const { data, error } = await supabase
      .from("affiliate_payouts")
      .insert({
        affiliate_id: affiliateId,
        program_id: affiliate.program_id,
        payout_period_start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        payout_period_end: new Date().toISOString().split("T")[0],
        total_amount: amount,
        sales_commission: amount,
        payment_method: paymentMethod,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    // Update affiliate paid commissions
    await supabase
      .from("affiliates")
      .update({
        total_paid_commissions: supabase.raw(`total_paid_commissions + ${amount}`),
        pending_commissions: supabase.raw(`pending_commissions - ${amount}`),
        updated_at: new Date().toISOString(),
      })
      .eq("id", affiliateId)

    revalidatePath("/admin/affiliate")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Marketing Materials
export async function createMarketingMaterial(formData: FormData) {
  try {
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    const program_id = formData.get("program_id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const material_type = formData.get("material_type") as string
    const content_url = formData.get("content_url") as string
    const html_code = formData.get("html_code") as string

    const { data, error } = await supabase
      .from("affiliate_marketing_materials")
      .insert({
        program_id,
        title,
        description,
        material_type,
        content_url,
        html_code,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/affiliate")
    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function getMarketingMaterials(programId?: string) {
  try {
    const supabase = createClient()

    let query = supabase
      .from("affiliate_marketing_materials")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })

    if (programId) {
      query = query.eq("program_id", programId)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Fraud Detection
export async function getFraudIncidents(affiliateId?: string) {
  try {
    const supabase = createClient()

    let query = supabase
      .from("affiliate_fraud_incidents")
      .select(`
        *,
        affiliates(affiliate_code, business_name),
        affiliate_fraud_rules(rule_name, rule_type)
      `)
      .order("created_at", { ascending: false })

    if (affiliateId) {
      query = query.eq("affiliate_id", affiliateId)
    }

    const { data, error } = await query

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

// Dashboard Statistics
export async function getAffiliateDashboardStats() {
  try {
    const supabase = createClient()

    // Get program count
    const { count: programCount } = await supabase
      .from("affiliate_programs")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get affiliate count
    const { count: affiliateCount } = await supabase
      .from("affiliates")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    // Get total conversions this month
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
    const { count: monthlyConversions } = await supabase
      .from("affiliate_conversions")
      .select("*", { count: "exact", head: true })
      .gte("converted_at", startOfMonth)
      .eq("status", "approved")

    // Get total commission this month
    const { data: monthlyCommissions } = await supabase
      .from("affiliate_conversions")
      .select("commission_amount")
      .gte("converted_at", startOfMonth)
      .eq("status", "approved")

    const totalCommissions =
      monthlyCommissions?.reduce((sum, conv) => sum + Number.parseFloat(conv.commission_amount), 0) || 0

    // Get pending payouts
    const { data: pendingPayouts } = await supabase
      .from("affiliate_payouts")
      .select("total_amount")
      .eq("status", "pending")

    const totalPendingPayouts =
      pendingPayouts?.reduce((sum, payout) => sum + Number.parseFloat(payout.total_amount), 0) || 0

    return {
      success: true,
      data: {
        active_programs: programCount || 0,
        active_affiliates: affiliateCount || 0,
        monthly_conversions: monthlyConversions || 0,
        monthly_commissions: totalCommissions,
        pending_payouts: totalPendingPayouts,
      },
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
