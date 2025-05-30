"use server"

import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"

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

    // Fetch both card and link payment methods
    const [cardMethods, linkMethods] = await Promise.all([
      stripe.paymentMethods.list({
        customer: customerId,
        type: "card",
      }),
      stripe.paymentMethods.list({
        customer: customerId,
        type: "link",
      }),
    ])

    // Combine both types of payment methods
    const allPaymentMethods = [...cardMethods.data, ...linkMethods.data]

    return { success: true, paymentMethods: allPaymentMethods }
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
      payment_method_types: ["card", "us_bank_account", "link"], // Added Link support
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

export async function createPaymentIntent(customerId: string, amount: number, currency = "usd") {
  try {
    const stripe = getStripe()
    const paymentIntent = await stripe.paymentIntents.create({
      customer: customerId,
      amount: amount * 100, // Convert to cents
      currency,
      payment_method_types: ["card", "link"],
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: "never",
      },
      metadata: {
        source: "bigbased_billing",
      },
    })
    return { success: true, clientSecret: paymentIntent.client_secret }
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return { success: false, error: "Failed to create payment intent" }
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
      return {
        success: false,
        error: "Authentication required",
        debug: { authError: userError },
      }
    }

    const user = userData.user

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError) {
      return {
        success: false,
        error: "Profile not found",
        debug: { profileError },
      }
    }

    // Store Stripe customer ID in social_links JSON field instead
    // This bypasses the schema cache issue with stripe_customer_id column
    const socialLinks = profile.social_links || {}

    // If stripe customer already exists in social_links, return it
    if (socialLinks.stripe_customer_id) {
      return {
        success: true,
        customerId: socialLinks.stripe_customer_id,
        debug: { existingCustomer: socialLinks.stripe_customer_id },
      }
    }

    // Create new Stripe customer
    const customerResult = await createCustomer(
      user.email!,
      profile.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    )

    if (!customerResult.success) {
      return {
        success: false,
        error: customerResult.error || "Failed to create Stripe customer",
        debug: { customerError: customerResult },
      }
    }

    // Update social_links with stripe customer ID
    const updatedSocialLinks = {
      ...socialLinks,
      stripe_customer_id: customerResult.customerId,
    }

    // Update profile with stripe customer ID in social_links
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        social_links: updatedSocialLinks,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating profile with stripe customer ID:", updateError)
      return {
        success: false,
        error: "Failed to save customer information",
        debug: { updateError, customerId: customerResult.customerId },
      }
    }

    return {
      success: true,
      customerId: customerResult.customerId,
      debug: { newCustomer: customerResult.customerId },
    }
  } catch (error: any) {
    console.error("Error in getOrCreateStripeCustomer:", error)
    return {
      success: false,
      error: "An unexpected error occurred",
      debug: { unexpectedError: error.message, stack: error.stack },
    }
  }
}
