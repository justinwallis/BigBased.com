"use server"

import { createClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export async function getCurrentSubscription() {
  try {
    const supabase = createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return null
    }

    // Get user profile with subscription info
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
      return null
    }

    // Check if the user has subscription info in their profile
    const socialLinks = profile.social_links || {}
    const subscriptionPlan = socialLinks.subscription_plan || "free"
    const subscriptionStatus = socialLinks.subscription_status || "inactive"
    const subscriptionPeriodEnd = socialLinks.subscription_period_end || null

    // Return subscription info
    return {
      planId: subscriptionPlan,
      name: SUBSCRIPTION_PLANS[subscriptionPlan as keyof typeof SUBSCRIPTION_PLANS]?.name || "Free Plan",
      isActive: subscriptionStatus === "active",
      currentPeriodEnd: subscriptionPeriodEnd ? new Date(subscriptionPeriodEnd) : null,
      cancelAtPeriodEnd: socialLinks.subscription_cancel_at_period_end || false,
    }
  } catch (error) {
    console.error("Error getting current subscription:", error)
    return null
  }
}

export async function createCheckoutSession(planId: string, customerId: string) {
  try {
    // Instead of creating a real Stripe checkout session, we'll create a mock checkout page
    // This will simulate the checkout process without needing actual Stripe price IDs

    // Store the selected plan in the database temporarily
    const supabase = createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return { success: false, error: "Authentication required" }
    }

    // Store the pending subscription in the user's profile
    await supabase
      .from("profiles")
      .update({
        pending_subscription: {
          plan_id: planId,
          created_at: new Date().toISOString(),
        },
      })
      .eq("id", userData.user.id)

    // Return a URL to our mock checkout page
    return {
      success: true,
      url: `/checkout/subscription?plan=${planId}`,
    }
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: error.message || "Failed to create checkout session" }
  }
}

export async function completeSubscription(planId: string) {
  try {
    const supabase = createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return { success: false, error: "Authentication required" }
    }

    // Get the user's profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single()

    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    // Calculate subscription end date (1 month from now)
    const currentDate = new Date()
    const endDate = new Date()
    endDate.setMonth(currentDate.getMonth() + 1)

    // Update the user's profile with the new subscription
    const socialLinks = profile.social_links || {}
    const updatedSocialLinks = {
      ...socialLinks,
      subscription_plan: planId,
      subscription_status: "active",
      subscription_period_end: endDate.toISOString(),
      subscription_cancel_at_period_end: false,
      pending_subscription: null,
    }

    await supabase
      .from("profiles")
      .update({
        social_links: updatedSocialLinks,
      })
      .eq("id", userData.user.id)

    return { success: true }
  } catch (error: any) {
    console.error("Error completing subscription:", error)
    return { success: false, error: error.message || "Failed to complete subscription" }
  }
}

export async function cancelSubscription() {
  try {
    const supabase = createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return { success: false, error: "Authentication required" }
    }

    // Get the user's profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userData.user.id).single()

    if (!profile) {
      return { success: false, error: "Profile not found" }
    }

    // Update the user's profile to cancel the subscription at period end
    const socialLinks = profile.social_links || {}
    const updatedSocialLinks = {
      ...socialLinks,
      subscription_cancel_at_period_end: true,
    }

    await supabase
      .from("profiles")
      .update({
        social_links: updatedSocialLinks,
      })
      .eq("id", userData.user.id)

    return { success: true }
  } catch (error: any) {
    console.error("Error canceling subscription:", error)
    return { success: false, error: error.message || "Failed to cancel subscription" }
  }
}
