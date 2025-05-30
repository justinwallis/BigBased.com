"use server"

import { createClient } from "@/lib/supabase/server"
import { getOrCreateStripeCustomer } from "./stripe-actions"

export async function debugUserProfile() {
  const timestamp = new Date().toISOString()
  const steps: string[] = []
  const errors: string[] = []

  try {
    steps.push("Checking environment variables...")

    // Check environment variables
    const envVars = {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextPublicSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    }

    steps.push("Testing regular Supabase client...")

    // Test regular client
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    const regularClient = {
      hasUser: !!userData?.user,
      userId: userData?.user?.id || null,
      userEmail: userData?.user?.email || null,
      error: userError,
    }

    steps.push("Testing profiles table...")

    // Test profiles table access
    let profileData: any = { exists: false, profile: null, error: null }

    if (userData?.user) {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userData.user.id)
        .single()

      profileData = {
        exists: !!profile,
        profile,
        error: profileError,
      }
    }

    steps.push("Testing billing_customers table...")

    // Test billing_customers table access
    let billingTableTest: any = { success: false, error: null }

    if (userData?.user) {
      const { data: billingData, error: billingError } = await supabase
        .from("billing_customers")
        .select("*")
        .eq("user_id", userData.user.id)
        .single()

      billingTableTest = {
        success: !billingError || billingError.code === "PGRST116", // PGRST116 means no rows found, which is OK
        data: billingData,
        error: billingError,
        hasStripeCustomer: !!billingData?.stripe_customer_id,
      }
    }

    return {
      timestamp,
      steps,
      errors,
      envVars,
      regularClient,
      profileData,
      billingTableTest,
    }
  } catch (error: any) {
    errors.push(`Unexpected error: ${error.message}`)
    return {
      timestamp,
      steps,
      errors,
      error: error.message,
    }
  }
}

export async function testStripeCustomerCreation() {
  const timestamp = new Date().toISOString()
  const steps: string[] = []
  const errors: string[] = []

  try {
    steps.push("Getting user data...")

    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      errors.push("User not authenticated")
      return { timestamp, steps, errors, user: null }
    }

    const user = {
      id: userData.user.id,
      email: userData.user.email,
      metadata: userData.user.user_metadata,
    }

    steps.push("Testing getOrCreateStripeCustomer...")

    // Test the main function
    const result = await getOrCreateStripeCustomer()

    steps.push("Verifying billing_customers table...")

    // Verify the billing customer was created
    const { data: billingCustomer, error: billingError } = await supabase
      .from("billing_customers")
      .select("*")
      .eq("user_id", userData.user.id)
      .single()

    return {
      timestamp,
      steps,
      errors,
      user,
      result,
      verification: {
        billingCustomer,
        billingError,
      },
    }
  } catch (error: any) {
    errors.push(`Unexpected error: ${error.message}`)
    return {
      timestamp,
      steps,
      errors,
      error: error.message,
    }
  }
}
