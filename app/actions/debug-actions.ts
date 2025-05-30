"use server"

import { createClient } from "@/lib/supabase/server"

export async function debugUserProfile() {
  const timestamp = new Date().toISOString()
  const environment = process.env.NODE_ENV || "development"
  const steps: string[] = []
  const errors: string[] = []

  try {
    steps.push("Checking environment variables...")

    // Check environment variables
    const envVars = {
      supabaseUrl: !!process.env.SUPABASE_URL || !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY || !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      supabaseServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      nextPublicSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      nextPublicSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      stripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripePublishableKey: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    }

    steps.push("Testing regular Supabase client...")

    // Test regular client
    const regularClient = createClient(false)
    const { data: userData, error: userError } = await regularClient.auth.getUser()

    const regularClientResult = {
      hasUser: !!userData?.user,
      userId: userData?.user?.id || null,
      userEmail: userData?.user?.email || null,
      error: userError
        ? {
            message: userError.message,
            status: userError.status,
          }
        : null,
    }

    steps.push("Testing new RPC functions...")

    // Test the new RPC functions
    let rpcTest = null
    if (userData?.user) {
      try {
        const { data: stripeData, error: stripeError } = await regularClient.rpc("get_profile_stripe_customer", {
          user_id: userData.user.id,
        })

        rpcTest = {
          success: !stripeError,
          data: stripeData,
          error: stripeError
            ? {
                message: stripeError.message,
                code: stripeError.code,
                details: stripeError.details,
                hint: stripeError.hint,
              }
            : null,
        }
      } catch (error: any) {
        rpcTest = {
          success: false,
          error: {
            message: error.message,
            type: "exception",
          },
        }
      }
    }

    steps.push("Testing service role client...")

    // Test service role client
    const serviceClient = createClient(true)
    let serviceRpcTest = null
    if (userData?.user) {
      try {
        const { data: serviceStripeData, error: serviceStripeError } = await serviceClient.rpc(
          "get_profile_stripe_customer",
          {
            user_id: userData.user.id,
          },
        )

        serviceRpcTest = {
          success: !serviceStripeError,
          data: serviceStripeData,
          error: serviceStripeError
            ? {
                message: serviceStripeError.message,
                code: serviceStripeError.code,
                details: serviceStripeError.details,
                hint: serviceStripeError.hint,
              }
            : null,
        }
      } catch (error: any) {
        serviceRpcTest = {
          success: false,
          error: {
            message: error.message,
            type: "exception",
          },
        }
      }
    }

    return {
      timestamp,
      environment,
      steps,
      errors,
      envVars,
      regularClient: regularClientResult,
      rpcTest,
      serviceRpcTest,
    }
  } catch (error: any) {
    errors.push(`Debug error: ${error.message}`)
    return {
      timestamp,
      environment,
      steps,
      errors,
      exception: error.message,
    }
  }
}

export async function testStripeCustomerCreation() {
  const timestamp = new Date().toISOString()
  const steps: string[] = []
  const errors: string[] = []

  try {
    steps.push("Getting user data...")

    const supabase = createClient(true) // Use service role
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return {
        timestamp,
        steps,
        errors: ["No authenticated user found"],
        user: null,
      }
    }

    const user = userData.user

    steps.push("Testing get_profile_stripe_customer RPC...")

    // Test getting existing stripe customer
    const { data: existingCustomer, error: getError } = await supabase.rpc("get_profile_stripe_customer", {
      user_id: user.id,
    })

    const getResult = {
      success: !getError,
      data: existingCustomer,
      error: getError
        ? {
            message: getError.message,
            code: getError.code,
            details: getError.details,
            hint: getError.hint,
          }
        : null,
    }

    steps.push("Testing update_profile_stripe_customer RPC...")

    // Test updating stripe customer (with a test ID)
    const testCustomerId = `cus_test_${Date.now()}`
    const { error: updateError } = await supabase.rpc("update_profile_stripe_customer", {
      user_id: user.id,
      customer_id: testCustomerId,
    })

    const updateResult = {
      success: !updateError,
      testCustomerId,
      error: updateError
        ? {
            message: updateError.message,
            code: updateError.code,
            details: updateError.details,
            hint: updateError.hint,
          }
        : null,
    }

    // Clean up - remove the test customer ID
    if (!updateError) {
      await supabase.rpc("update_profile_stripe_customer", {
        user_id: user.id,
        customer_id: null,
      })
    }

    return {
      timestamp,
      steps,
      errors,
      user: {
        id: user.id,
        email: user.email,
        metadata: user.user_metadata,
      },
      getResult,
      updateResult,
    }
  } catch (error: any) {
    errors.push(`Test error: ${error.message}`)
    return {
      timestamp,
      steps,
      errors,
      exception: error.message,
    }
  }
}
