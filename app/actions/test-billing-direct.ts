"use server"

import { createClient } from "@/lib/supabase/server"

export async function testBillingDirect() {
  try {
    const supabase = createClient(true) // Use service role to bypass RLS

    // Try to get the current user first
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return {
        success: false,
        error: "Authentication required",
        step: "auth",
      }
    }

    // Try a simple select with service role
    const { data: selectData, error: selectError } = await supabase.rpc("sql", {
      query: "SELECT * FROM public.billing_customers LIMIT 1",
    })

    if (selectError) {
      return {
        success: false,
        error: selectError.message,
        step: "rpc_select",
        selectError,
      }
    }

    // Try direct insert with service role
    const testCustomerId = `cus_test_${Date.now()}`

    const { data: insertData, error: insertError } = await supabase.rpc("sql", {
      query: `
          INSERT INTO public.billing_customers (user_id, stripe_customer_id, created_at, updated_at)
          VALUES ('${userData.user.id}', '${testCustomerId}', NOW(), NOW())
          RETURNING *;
        `,
    })

    if (insertError) {
      return {
        success: false,
        error: insertError.message,
        step: "rpc_insert",
        insertError,
      }
    }

    // Clean up the test data
    await supabase.rpc("sql", {
      query: `DELETE FROM public.billing_customers WHERE stripe_customer_id = '${testCustomerId}';`,
    })

    return {
      success: true,
      message: "Direct SQL operations work!",
      selectData,
      insertData,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      step: "catch",
    }
  }
}

export async function createStripeCustomerDirect() {
  try {
    const supabase = createClient(true) // Use service role

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return {
        success: false,
        error: "Authentication required",
      }
    }

    // Create Stripe customer
    const { createCustomer } = await import("@/app/actions/stripe-actions")
    const customerResult = await createCustomer(
      userData.user.email!,
      userData.user.user_metadata?.full_name || userData.user.email,
    )

    if (!customerResult.success) {
      return {
        success: false,
        error: "Failed to create Stripe customer",
        debug: customerResult,
      }
    }

    // Insert using direct SQL
    const { data: insertData, error: insertError } = await supabase.rpc("sql", {
      query: `
          INSERT INTO public.billing_customers (user_id, stripe_customer_id, created_at, updated_at)
          VALUES ('${userData.user.id}', '${customerResult.customerId}', NOW(), NOW())
          ON CONFLICT (user_id) DO UPDATE SET 
            stripe_customer_id = EXCLUDED.stripe_customer_id,
            updated_at = NOW()
          RETURNING *;
        `,
    })

    if (insertError) {
      return {
        success: false,
        error: "Failed to save billing customer",
        debug: { insertError, customerId: customerResult.customerId },
      }
    }

    return {
      success: true,
      customerId: customerResult.customerId,
      billingData: insertData,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
