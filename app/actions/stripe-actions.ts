"use server"

import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function createCustomer(email: string, name?: string) {
  try {
    const stripe = getStripe()
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: "bigbased_website",
      },
    })
    return { success: true, customerId: customer.id }
  } catch (error) {
    console.error("Error creating Stripe customer:", error)
    return { success: false, error: "Failed to create customer" }
  }
}

export async function getCustomerPaymentMethods(customerId: string) {
  try {
    const stripe = getStripe()
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    })
    return { success: true, paymentMethods: paymentMethods.data }
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return { success: false, error: "Failed to fetch payment methods" }
  }
}

export async function createSetupIntent(customerId: string) {
  try {
    const stripe = getStripe()
    const setupIntent = await stripe.setupIntents.create({
      customer: customerId,
      payment_method_types: ["card"],
      usage: "off_session",
      metadata: {
        source: "bigbased_billing",
      },
    })
    return { success: true, clientSecret: setupIntent.client_secret }
  } catch (error) {
    console.error("Error creating setup intent:", error)
    return { success: false, error: "Failed to create setup intent" }
  }
}

export async function deletePaymentMethod(paymentMethodId: string) {
  try {
    const stripe = getStripe()
    await stripe.paymentMethods.detach(paymentMethodId)
    return { success: true }
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return { success: false, error: "Failed to delete payment method" }
  }
}

export async function setDefaultPaymentMethod(customerId: string, paymentMethodId: string) {
  try {
    const stripe = getStripe()
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    })
    return { success: true }
  } catch (error) {
    console.error("Error setting default payment method:", error)
    return { success: false, error: "Failed to set default payment method" }
  }
}

export async function getOrCreateStripeCustomer() {
  try {
    // Use service role client to bypass any RLS issues
    const supabase = createClient(true)

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      redirect("/auth/sign-in?redirect=/profile/billing")
    }

    const user = userData.user

    // Use raw SQL to check for stripe_customer_id to bypass schema cache issues
    const { data: profileData, error: profileError } = await supabase.rpc("get_profile_stripe_customer", {
      user_id: user.id,
    })

    if (profileError) {
      console.error("Error fetching profile stripe customer:", profileError)

      // Fallback: try to get the profile data directly
      const { data: fallbackProfile, error: fallbackError } = await supabase
        .from("profiles")
        .select("id, username, full_name")
        .eq("id", user.id)
        .single()

      if (fallbackError) {
        console.error("Fallback profile fetch error:", fallbackError)
        return { success: false, error: "Failed to access user profile" }
      }
    }

    // If we have a stripe customer ID, return it
    if (profileData && profileData.length > 0 && profileData[0]?.stripe_customer_id) {
      return { success: true, customerId: profileData[0].stripe_customer_id }
    }

    // Create new Stripe customer
    const customerResult = await createCustomer(
      user.email!,
      user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    )

    if (!customerResult.success) {
      return customerResult
    }

    // Use raw SQL to update stripe_customer_id to bypass schema cache issues
    const { error: updateError } = await supabase.rpc("update_profile_stripe_customer", {
      user_id: user.id,
      customer_id: customerResult.customerId,
    })

    if (updateError) {
      console.error("Error saving Stripe customer ID:", updateError)
      return { success: false, error: "Failed to save customer information" }
    }

    return { success: true, customerId: customerResult.customerId }
  } catch (error: any) {
    console.error("Error in getOrCreateStripeCustomer:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
