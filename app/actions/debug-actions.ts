"use server"

import { createClient } from "@/lib/supabase/server"

export async function debugUserProfile() {
  const timestamp = new Date().toISOString()
  const steps = [
    "Checking environment variables...",
    "Testing regular Supabase client...",
    "Testing profiles table...",
    "Testing billing_customers table...",
    "Checking database connection details...",
  ]
  const errors: string[] = []

  try {
    // Check environment variables
    const envVars = {
      supabaseUrl: !!process.env.SUPABASE_URL,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextPublicSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      // Check if Neon variables exist (they shouldn't be used for Supabase)
      neonDatabaseUrl: !!process.env.NEON_DATABASE_URL,
      databaseUrl: !!process.env.DATABASE_URL,
    }

    // Log actual URLs (first 20 chars for security)
    const connectionInfo = {
      supabaseUrl: process.env.SUPABASE_URL?.substring(0, 30) + "...",
      nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
      databaseUrl: process.env.DATABASE_URL?.substring(0, 30) + "...",
      neonUrl: process.env.NEON_DATABASE_URL?.substring(0, 30) + "...",
    }

    // Test regular Supabase client
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    const regularClient = {
      hasUser: !!userData?.user,
      userId: userData?.user?.id || null,
      userEmail: userData?.user?.email || null,
      error: userError,
    }

    // Test profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData?.user?.id || "")
      .single()

    const profileData = {
      exists: !!profile,
      profile: profile,
      error: profileError,
    }

    // Test billing_customers table
    const { data: billingData, error: billingError } = await supabase
      .from("billing_customers")
      .select("*")
      .eq("user_id", userData?.user?.id || "")
      .single()

    const billingTableTest = {
      success: !billingError || billingError.code === "PGRST116", // PGRST116 = no rows found (which is OK)
      data: billingData,
      error: billingError,
      hasStripeCustomer: !!billingData?.stripe_customer_id,
    }

    return {
      timestamp,
      steps,
      errors,
      envVars,
      connectionInfo,
      regularClient,
      profileData,
      billingTableTest,
    }
  } catch (error: any) {
    errors.push(error.message)
    return {
      timestamp,
      steps,
      errors,
      envVars: {},
      connectionInfo: {},
      regularClient: { error: error.message },
      profileData: { error: error.message },
      billingTableTest: { error: error.message },
    }
  }
}

export async function testStripeCustomerCreation() {
  const timestamp = new Date().toISOString()
  const steps = [
    "Getting user data...",
    "Testing getOrCreateStripeCustomer...",
    "Verifying billing_customers table...",
    "Checking actual database connection...",
  ]
  const errors: string[] = []

  try {
    // Get user data
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return {
        timestamp,
        steps,
        errors: ["Authentication failed"],
        user: null,
        result: { success: false, error: "Not authenticated" },
      }
    }

    const user = {
      id: userData.user.id,
      email: userData.user.email,
      metadata: userData.user.user_metadata,
    }

    // Test the actual function
    const { getOrCreateStripeCustomer } = await import("@/app/actions/stripe-actions")
    const result = await getOrCreateStripeCustomer()

    // Verify billing_customers table after the operation
    const { data: billingCustomer, error: billingError } = await supabase
      .from("billing_customers")
      .select("*")
      .eq("user_id", userData.user.id)
      .single()

    // Check what database we're actually connecting to
    const connectionTest = {
      supabaseUrl: process.env.SUPABASE_URL?.substring(0, 50) + "...",
      clientUrl: "Check if client is using correct URL",
    }

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
      connectionTest,
    }
  } catch (error: any) {
    errors.push(error.message)
    return {
      timestamp,
      steps,
      errors,
      user: null,
      result: { success: false, error: error.message },
    }
  }
}
