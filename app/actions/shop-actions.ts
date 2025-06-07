"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { generateSlug } from "@/lib/utils"

// Types
export interface Shop {
  id: string
  owner_id: string
  name: string
  slug: string
  domain_id?: number
  custom_domain?: string
  description?: string
  logo_url?: string
  banner_url?: string
  primary_color?: string
  accent_color?: string
  status: "active" | "pending" | "suspended" | "closed"
  verification_status: "unverified" | "pending" | "verified"
  plan_id?: string
  features_enabled: Record<string, boolean>
  settings: Record<string, any>
  created_at: string
  updated_at: string
}

export interface ShopPlan {
  id: string
  name: string
  description?: string
  price: number
  billing_interval: "monthly" | "quarterly" | "annual" | "lifetime"
  features: Record<string, boolean>
  limits: Record<string, number | null>
  is_active: boolean
  is_featured: boolean
  trial_days: number
  sort_order: number
}

// Create a new shop
export async function createShop(formData: FormData) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const planId = formData.get("plan_id") as string

    if (!name) {
      return { success: false, error: "Shop name is required" }
    }

    // Generate slug from name
    let slug = generateSlug(name)

    // Check if slug exists
    const { data: existingShop } = await supabase.from("shops").select("slug").eq("slug", slug).single()
    if (existingShop) {
      // Append random string to make slug unique
      slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`
    }

    // Get default plan if not specified
    let finalPlanId = planId
    if (!finalPlanId) {
      const { data: defaultPlan } = await supabase.from("shop_plans").select("id").eq("name", "Basic").single()
      finalPlanId = defaultPlan?.id
    }

    // Create shop
    const { data: shop, error } = await supabase
      .from("shops")
      .insert({
        owner_id: user.id,
        name,
        slug,
        description,
        plan_id: finalPlanId,
        status: "active",
        verification_status: "unverified",
        features_enabled: {
          products: true,
          orders: true,
          customers: true,
          discounts: true,
        },
        settings: {
          currency: "USD",
          weight_unit: "kg",
          timezone: "UTC",
          inventory_tracking: true,
        },
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating shop:", error)
      return { success: false, error: error.message }
    }

    // Create shop subscription with trial
    if (finalPlanId) {
      const trialEndDate = new Date()
      trialEndDate.setDate(trialEndDate.getDate() + 14) // 14-day trial

      await supabase.from("shop_subscriptions").insert({
        shop_id: shop.id,
        plan_id: finalPlanId,
        status: "trialing",
        current_period_start: new Date().toISOString(),
        current_period_end: trialEndDate.toISOString(),
        trial_start: new Date().toISOString(),
        trial_end: trialEndDate.toISOString(),
      })
    }

    // Create default product category for this shop
    await supabase.from("product_categories").insert({
      shop_id: shop.id,
      name: "Uncategorized",
      slug: "uncategorized",
      description: "Default category for products",
      sort_order: 999,
    })

    // Create default customer groups for this shop
    await supabase.from("customer_groups").insert([
      {
        shop_id: shop.id,
        name: "All Customers",
        description: "Default group for all customers",
        is_system_defined: true,
      },
      {
        shop_id: shop.id,
        name: "VIP Customers",
        description: "Customers who have spent a significant amount",
        is_system_defined: true,
      },
      {
        shop_id: shop.id,
        name: "Wholesale",
        description: "Wholesale customers with special pricing",
        is_system_defined: true,
      },
    ])

    revalidatePath("/admin/shops")
    return { success: true, data: shop }
  } catch (error: any) {
    console.error("Error in createShop:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Get all shops for the current user
export async function getUserShops() {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Get shops owned by user
    const { data: ownedShops, error: ownedError } = await supabase
      .from("shops")
      .select(
        `
        *,
        shop_plans(name, price, billing_interval)
      `,
      )
      .eq("owner_id", user.id)
      .order("created_at", { ascending: false })

    if (ownedError) {
      console.error("Error fetching owned shops:", ownedError)
      return { success: false, error: ownedError.message }
    }

    // Get shops where user is staff
    const { data: staffShops, error: staffError } = await supabase
      .from("shop_staff")
      .select(
        `
        shops(
          *,
          shop_plans(name, price, billing_interval)
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("invitation_status", "accepted")

    if (staffError) {
      console.error("Error fetching staff shops:", staffError)
      return { success: false, error: staffError.message }
    }

    // Combine and format results
    const shops = [...ownedShops, ...(staffShops?.map((item) => ({ ...item.shops, role: "staff" })) || [])]

    return { success: true, data: shops }
  } catch (error: any) {
    console.error("Error in getUserShops:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Get a single shop by ID or slug
export async function getShop(idOrSlug: string) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Determine if idOrSlug is a UUID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)

    // Query by ID or slug
    let query = supabase.from("shops").select(
      `
        *,
        shop_plans(*)
      `,
    )

    if (isUuid) {
      query = query.eq("id", idOrSlug)
    } else {
      query = query.eq("slug", idOrSlug)
    }

    const { data: shop, error } = await query.single()

    if (error) {
      console.error("Error fetching shop:", error)
      return { success: false, error: error.message }
    }

    // Check if user has access to this shop
    if (shop.owner_id !== user.id) {
      // Check if user is staff
      const { data: staffAccess } = await supabase
        .from("shop_staff")
        .select("role, permissions")
        .eq("shop_id", shop.id)
        .eq("user_id", user.id)
        .eq("invitation_status", "accepted")
        .single()

      if (!staffAccess) {
        return { success: false, error: "You don't have access to this shop" }
      }

      // Add staff role and permissions to shop object
      shop.userRole = staffAccess.role
      shop.userPermissions = staffAccess.permissions
    } else {
      shop.userRole = "owner"
      shop.userPermissions = { all: true }
    }

    return { success: true, data: shop }
  } catch (error: any) {
    console.error("Error in getShop:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Update shop details
export async function updateShop(shopId: string, formData: FormData) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if user has access to this shop
    const { data: shop } = await supabase.from("shops").select("owner_id").eq("id", shopId).single()

    if (!shop) {
      return { success: false, error: "Shop not found" }
    }

    if (shop.owner_id !== user.id) {
      // Check if user is admin staff
      const { data: staffAccess } = await supabase
        .from("shop_staff")
        .select("role")
        .eq("shop_id", shopId)
        .eq("user_id", user.id)
        .eq("invitation_status", "accepted")
        .single()

      if (!staffAccess || staffAccess.role !== "admin") {
        return { success: false, error: "You don't have permission to update this shop" }
      }
    }

    // Get form data
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const customDomain = formData.get("custom_domain") as string
    const logoUrl = formData.get("logo_url") as string
    const bannerUrl = formData.get("banner_url") as string
    const primaryColor = formData.get("primary_color") as string
    const accentColor = formData.get("accent_color") as string
    const businessEmail = formData.get("business_email") as string
    const supportEmail = formData.get("support_email") as string
    const businessPhone = formData.get("business_phone") as string

    // Update shop
    const { data, error } = await supabase
      .from("shops")
      .update({
        name,
        description,
        custom_domain: customDomain,
        logo_url: logoUrl,
        banner_url: bannerUrl,
        primary_color: primaryColor,
        accent_color: accentColor,
        business_email: businessEmail,
        support_email: supportEmail,
        business_phone: businessPhone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", shopId)
      .select()
      .single()

    if (error) {
      console.error("Error updating shop:", error)
      return { success: false, error: error.message }
    }

    revalidatePath(`/admin/shops/${shopId}`)
    revalidatePath(`/admin/shops`)
    return { success: true, data }
  } catch (error: any) {
    console.error("Error in updateShop:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Get available shop plans
export async function getShopPlans() {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from("shop_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })

    if (error) {
      console.error("Error fetching shop plans:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error: any) {
    console.error("Error in getShopPlans:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Change shop plan
export async function changeShopPlan(shopId: string, planId: string) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if user is shop owner
    const { data: shop } = await supabase.from("shops").select("owner_id").eq("id", shopId).single()

    if (!shop) {
      return { success: false, error: "Shop not found" }
    }

    if (shop.owner_id !== user.id) {
      return { success: false, error: "Only the shop owner can change the plan" }
    }

    // Update shop plan
    const { error: shopError } = await supabase
      .from("shops")
      .update({
        plan_id: planId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", shopId)

    if (shopError) {
      console.error("Error updating shop plan:", shopError)
      return { success: false, error: shopError.message }
    }

    // Get plan details for subscription
    const { data: plan } = await supabase.from("shop_plans").select("*").eq("id", planId).single()

    if (!plan) {
      return { success: false, error: "Plan not found" }
    }

    // Calculate subscription dates
    const now = new Date()
    const endDate = new Date()

    if (plan.billing_interval === "monthly") {
      endDate.setMonth(endDate.getMonth() + 1)
    } else if (plan.billing_interval === "quarterly") {
      endDate.setMonth(endDate.getMonth() + 3)
    } else if (plan.billing_interval === "annual") {
      endDate.setFullYear(endDate.getFullYear() + 1)
    } else if (plan.billing_interval === "lifetime") {
      endDate.setFullYear(endDate.getFullYear() + 100) // Effectively lifetime
    }

    // Update or create subscription
    const { data: existingSubscription } = await supabase
      .from("shop_subscriptions")
      .select("id")
      .eq("shop_id", shopId)
      .single()

    if (existingSubscription) {
      // Update existing subscription
      await supabase
        .from("shop_subscriptions")
        .update({
          plan_id: planId,
          status: "active",
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
        })
        .eq("shop_id", shopId)
    } else {
      // Create new subscription
      await supabase.from("shop_subscriptions").insert({
        shop_id: shopId,
        plan_id: planId,
        status: "active",
        current_period_start: now.toISOString(),
        current_period_end: endDate.toISOString(),
      })
    }

    revalidatePath(`/admin/shops/${shopId}`)
    revalidatePath(`/admin/shops`)
    return { success: true, data: plan }
  } catch (error: any) {
    console.error("Error in changeShopPlan:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Delete a shop
export async function deleteShop(shopId: string) {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if user is shop owner
    const { data: shop } = await supabase.from("shops").select("owner_id").eq("id", shopId).single()

    if (!shop) {
      return { success: false, error: "Shop not found" }
    }

    if (shop.owner_id !== user.id) {
      return { success: false, error: "Only the shop owner can delete the shop" }
    }

    // Delete shop (cascade will handle related records)
    const { error } = await supabase.from("shops").delete().eq("id", shopId)

    if (error) {
      console.error("Error deleting shop:", error)
      return { success: false, error: error.message }
    }

    revalidatePath("/admin/shops")
    return { success: true }
  } catch (error: any) {
    console.error("Error in deleteShop:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}

// Get shop analytics
export async function getShopAnalytics(shopId: string, period: "7d" | "30d" | "90d" | "1y" = "30d") {
  try {
    const supabase = createClient()

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check if user has access to this shop
    const { data: shop } = await supabase.from("shops").select("owner_id").eq("id", shopId).single()

    if (!shop) {
      return { success: false, error: "Shop not found" }
    }

    if (shop.owner_id !== user.id) {
      // Check if user is staff
      const { data: staffAccess } = await supabase
        .from("shop_staff")
        .select("role")
        .eq("shop_id", shopId)
        .eq("user_id", user.id)
        .eq("invitation_status", "accepted")
        .single()

      if (!staffAccess) {
        return { success: false, error: "You don't have access to this shop" }
      }
    }

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()

    switch (period) {
      case "7d":
        startDate.setDate(startDate.getDate() - 7)
        break
      case "30d":
        startDate.setDate(startDate.getDate() - 30)
        break
      case "90d":
        startDate.setDate(startDate.getDate() - 90)
        break
      case "1y":
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
    }

    // Get analytics data
    const [ordersResult, customersResult, productsResult, revenueResult] = await Promise.all([
      // Orders analytics
      supabase
        .from("orders")
        .select("id, total_amount, status, created_at")
        .eq("shop_id", shopId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString()),

      // Customers analytics
      supabase
        .from("customers")
        .select("id, created_at")
        .eq("shop_id", shopId)
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString()),

      // Products count
      supabase
        .from("products")
        .select("id, status")
        .eq("shop_id", shopId),

      // Revenue analytics
      supabase
        .from("orders")
        .select("total_amount, created_at")
        .eq("shop_id", shopId)
        .eq("status", "completed")
        .gte("created_at", startDate.toISOString())
        .lte("created_at", endDate.toISOString()),
    ])

    const orders = ordersResult.data || []
    const customers = customersResult.data || []
    const products = productsResult.data || []
    const revenue = revenueResult.data || []

    // Calculate metrics
    const totalOrders = orders.length
    const totalCustomers = customers.length
    const totalProducts = products.length
    const activeProducts = products.filter((p) => p.status === "active").length
    const totalRevenue = revenue.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

    // Calculate order status breakdown
    const ordersByStatus = orders.reduce(
      (acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      success: true,
      data: {
        totalOrders,
        totalCustomers,
        totalProducts,
        activeProducts,
        totalRevenue,
        averageOrderValue,
        ordersByStatus,
        period,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
    }
  } catch (error: any) {
    console.error("Error in getShopAnalytics:", error)
    return { success: false, error: error.message || "An unexpected error occurred" }
  }
}
