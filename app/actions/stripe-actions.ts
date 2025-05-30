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
    // Use regular client first
    const supabase = createClient(false)

    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      redirect("/auth/sign-in?redirect=/profile/billing")
    }

    const user = userData.user

    // Check if profile exists and has stripe_customer_id
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*") // Select all columns to avoid schema cache issues
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)

      // Try with service role client as fallback
      const serviceClient = createClient(true)
      const { data: serviceProfile, error: serviceProfileError } = await serviceClient
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

      if (serviceProfileError) {
        console.error("Service role profile fetch error:", serviceProfileError)
        return { success: false, error: "Failed to access user profile" }
      }

      // Use service profile if available
      if (serviceProfile?.stripe_customer_id) {
        return { success: true, customerId: serviceProfile.stripe_customer_id }
      }
    } else if (profile?.stripe_customer_id) {
      return { success: true, customerId: profile.stripe_customer_id }
    }

    // Create new Stripe customer
    const customerResult = await createCustomer(
      user.email!,
      user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    )

    if (!customerResult.success) {
      return customerResult
    }

    // Try to update with regular client first
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerResult.customerId })
      .eq("id", user.id)

    if (updateError) {
      console.error("Regular client update error:", updateError)

      // Try with service role client as fallback
      const serviceClient = createClient(true)
      const { error: serviceUpdateError } = await serviceClient
        .from("profiles")
        .update({ stripe_customer_id: customerResult.customerId })
        .eq("id", user.id)

      if (serviceUpdateError) {
        console.error("Service role update error:", serviceUpdateError)
        return { success: false, error: "Failed to save customer information" }
      }
    }

    return { success: true, customerId: customerResult.customerId }
  } catch (error: any) {
    console.error("Error in getOrCreateStripeCustomer:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
