"use server"

import { createClient } from "@/lib/supabase/server"

export async function getPayPalConnectionStatus() {
  try {
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return { success: false, error: "Authentication required" }
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("social_links")
      .eq("id", userData.user.id)
      .single()

    if (profileError) {
      return { success: false, error: "Profile not found" }
    }

    const socialLinks = profile.social_links || {}
    const isConnected = !!socialLinks.paypal_connected
    const paypalEmail = socialLinks.paypal_email || null

    return {
      success: true,
      isConnected,
      paypalEmail,
    }
  } catch (error: any) {
    console.error("Error getting PayPal connection status:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function disconnectPayPal() {
  try {
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return { success: false, error: "Authentication required" }
    }

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("social_links")
      .eq("id", userData.user.id)
      .single()

    if (profileError) {
      return { success: false, error: "Profile not found" }
    }

    const socialLinks = profile.social_links || {}

    // Remove PayPal connection info
    const {
      paypal_connected,
      paypal_email,
      paypal_access_token,
      paypal_refresh_token,
      paypal_token_expires_at,
      ...restSocialLinks
    } = socialLinks

    // If PayPal was the default payment method, clear it
    if (socialLinks.default_payment_method === "paypal") {
      restSocialLinks.default_payment_method = null
    }

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        social_links: restSocialLinks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userData.user.id)

    if (updateError) {
      return { success: false, error: "Failed to disconnect PayPal" }
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error disconnecting PayPal:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
