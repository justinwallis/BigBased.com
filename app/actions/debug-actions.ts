"use server"

import { createClient } from "@/lib/supabase/server"

export async function debugUserProfile() {
  const timestamp = new Date().toISOString()
  const steps = [
    "Checking environment variables...",
    "Testing regular Supabase client...",
    "Testing profiles table...",
    "Testing stripe_billing table with service role...",
    "Testing stripe_billing table with regular client...",
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
      neonDatabaseUrl: !!process.env.NEON_DATABASE_URL,
      databaseUrl: !!process.env.DATABASE_URL,
    }

    // Connection info
    const connectionInfo = {
      supabaseUrl: process.env.SUPABASE_URL?.substring(0, 50) + "...",
      nextPublicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 50) + "...",
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

    // Test stripe_billing table with service role
    const supabaseServiceRole = createClient(true)
    const { data: billingDataService, error: billingErrorService } = await supabaseServiceRole
      .from("stripe_billing")
      .select("*")
      .limit(1)

    const serviceRoleTest = {
      success: !billingErrorService,
      data: billingDataService,
      error: billingErrorService,
      count: billingDataService?.length || 0,
    }

    // Test stripe_billing table with regular client
    const { data: billingData, error: billingError } = await supabase
      .from("stripe_billing")
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
      serviceRoleTest,
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
      serviceRoleTest: { error: error.message },
      billingTableTest: { error: error.message },
    }
  }
}

export async function testStripeCustomerCreation() {
  const timestamp = new Date().toISOString()
  const steps = [
    "Getting user data...",
    "Testing direct table insert...",
    "Testing getOrCreateStripeCustomer...",
    "Verifying stripe_billing table...",
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

    // Test direct insert with service role
    const supabaseServiceRole = createClient(true)
    const testCustomerId = `cus_test_${Date.now()}`

    const { data: directInsert, error: directInsertError } = await supabaseServiceRole
      .from("stripe_billing")
      .insert({
        user_id: userData.user.id,
        stripe_customer_id: testCustomerId,
      })
      .select()
      .single()

    const directInsertTest = {
      success: !directInsertError,
      data: directInsert,
      error: directInsertError,
      testCustomerId,
    }

    // Clean up test data if successful
    if (directInsert) {
      await supabaseServiceRole.from("stripe_billing").delete().eq("id", directInsert.id)
    }

    // Test the actual function
    const { getOrCreateStripeCustomer } = await import("@/app/actions/stripe-actions")
    const result = await getOrCreateStripeCustomer()

    // Verify stripe_billing table after the operation
    const { data: billingCustomer, error: billingError } = await supabase
      .from("stripe_billing")
      .select("*")
      .eq("user_id", userData.user.id)
      .single()

    return {
      timestamp,
      steps,
      errors,
      user,
      directInsertTest,
      result,
      verification: {
        billingCustomer,
        billingError,
      },
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
