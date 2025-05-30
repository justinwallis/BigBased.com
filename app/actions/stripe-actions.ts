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
    // Use service role client to bypass RLS policies
    const supabase = createClient(true) // Use service role

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      console.error("Auth error:", userError)
      redirect("/auth/sign-in?redirect=/profile/billing")
    }

    console.log("Current user:", user.id, user.email)

    // Check if profile exists with this user ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("id", user.id)
      .single()

    console.log("Profile query result:", { profile, profileError })

    // If profile doesn't exist, create it
    if (profileError) {
      if (profileError.code === "PGRST116") {
        // PGRST116 means no rows returned
        console.log("Creating new profile for user:", user.id)

        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
            username: user.user_metadata?.username || user.email?.split("@")[0] || "",
            social_links: {},
          })
          .select()
          .single()

        if (insertError) {
          console.error("Error creating profile:", insertError)
          return { success: false, error: "Failed to create user profile", debug: insertError }
        }

        console.log("New profile created:", newProfile)
      } else {
        console.error("Error fetching profile:", profileError)
        return { success: false, error: "Failed to access user profile", debug: profileError }
      }
    }

    // Refetch profile if it was just created
    const { data: currentProfile, error: refetchError } = await supabase
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("id", user.id)
      .single()

    if (refetchError) {
      console.error("Error refetching profile:", refetchError)
      return { success: false, error: "Failed to access user profile after creation", debug: refetchError }
    }

    // If profile exists and has a Stripe customer ID, return it
    if (currentProfile?.stripe_customer_id) {
      console.log("Existing Stripe customer found:", currentProfile.stripe_customer_id)
      return { success: true, customerId: currentProfile.stripe_customer_id }
    }

    // Create new Stripe customer
    console.log("Creating new Stripe customer for user:", user.id)
    const customerResult = await createCustomer(
      user.email!,
      user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    )

    if (!customerResult.success) {
      return customerResult
    }

    console.log("Stripe customer created:", customerResult.customerId)

    // Save customer ID to profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerResult.customerId })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error saving Stripe customer ID:", updateError)
      return { success: false, error: "Failed to save customer information", debug: updateError }
    }

    console.log("Stripe customer ID saved to profile")
    return { success: true, customerId: customerResult.customerId }
  } catch (error) {
    console.error("Error in getOrCreateStripeCustomer:", error)
    return { success: false, error: "An unexpected error occurred", debug: error }
  }
}
