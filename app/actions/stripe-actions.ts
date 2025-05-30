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
    // Get the authenticated user from Supabase
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      redirect("/auth/sign-in?redirect=/profile/billing")
    }

    const user = userData.user

    // Check if profile exists in Supabase, if not create it
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    let currentProfile = profile

    if (profileError && profileError.code === "PGRST116") {
      // Profile doesn't exist, create it
      const { data: newProfile, error: createError } = await supabase
        .from("profiles")
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
          username: user.user_metadata?.username || user.email?.split("@")[0] || "",
          social_links: {},
        })
        .select()
        .single()

      if (createError) {
        console.error("Error creating profile:", createError)
        return { success: false, error: "Failed to create user profile" }
      }

      currentProfile = newProfile
    } else if (profileError) {
      console.error("Error fetching profile:", profileError)
      return { success: false, error: "Failed to access user profile" }
    }

    // If we have a stripe customer ID, return it
    if (currentProfile?.stripe_customer_id) {
      return { success: true, customerId: currentProfile.stripe_customer_id }
    }

    // Create new Stripe customer
    const customerResult = await createCustomer(
      user.email!,
      user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    )

    if (!customerResult.success) {
      return customerResult
    }

    // Save customer ID to profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        stripe_customer_id: customerResult.customerId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

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
