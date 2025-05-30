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
  const debugLog: any[] = []

  try {
    debugLog.push({ step: "Starting getOrCreateStripeCustomer", timestamp: new Date().toISOString() })

    // Try regular client first
    const regularClient = createClient(false)
    debugLog.push({ step: "Created regular client" })

    const { data: userData, error: userError } = await regularClient.auth.getUser()
    debugLog.push({
      step: "Got user data",
      hasUser: !!userData?.user,
      userId: userData?.user?.id,
      userError: userError
        ? {
            message: userError.message,
            status: userError.status,
          }
        : null,
    })

    if (userError || !userData?.user) {
      debugLog.push({ step: "No user found, redirecting to sign-in" })
      redirect("/auth/sign-in?redirect=/profile/billing")
    }

    const user = userData.user

    // Try to access profile with regular client first
    debugLog.push({ step: "Attempting profile access with regular client" })
    const { data: regularProfile, error: regularProfileError } = await regularClient
      .from("profiles")
      .select("id, stripe_customer_id")
      .eq("id", user.id)
      .single()

    debugLog.push({
      step: "Regular profile query result",
      hasProfile: !!regularProfile,
      profileData: regularProfile,
      error: regularProfileError
        ? {
            message: regularProfileError.message,
            code: regularProfileError.code,
            details: regularProfileError.details,
            hint: regularProfileError.hint,
          }
        : null,
    })

    // If regular client fails, try service role client
    if (regularProfileError) {
      debugLog.push({ step: "Regular client failed, trying service role client" })

      const serviceClient = createClient(true)
      const { data: serviceProfile, error: serviceProfileError } = await serviceClient
        .from("profiles")
        .select("id, stripe_customer_id")
        .eq("id", user.id)
        .single()

      debugLog.push({
        step: "Service role profile query result",
        hasProfile: !!serviceProfile,
        profileData: serviceProfile,
        error: serviceProfileError
          ? {
              message: serviceProfileError.message,
              code: serviceProfileError.code,
              details: serviceProfileError.details,
              hint: serviceProfileError.hint,
            }
          : null,
      })

      // If profile doesn't exist, create it
      if (serviceProfileError?.code === "PGRST116") {
        debugLog.push({ step: "Profile not found, creating new profile" })

        const { data: newProfile, error: insertError } = await serviceClient
          .from("profiles")
          .insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
            username: user.user_metadata?.username || user.email?.split("@")[0] || "",
            social_links: {},
          })
          .select("id, stripe_customer_id")
          .single()

        debugLog.push({
          step: "Profile creation result",
          success: !insertError,
          profileData: newProfile,
          error: insertError
            ? {
                message: insertError.message,
                code: insertError.code,
                details: insertError.details,
                hint: insertError.hint,
              }
            : null,
        })

        if (insertError) {
          console.error("Debug log:", debugLog)
          return {
            success: false,
            error: "Failed to create user profile",
            debug: { debugLog, insertError },
          }
        }
      } else if (serviceProfileError) {
        console.error("Debug log:", debugLog)
        return {
          success: false,
          error: "Failed to access user profile",
          debug: { debugLog, serviceProfileError },
        }
      }

      // Use service profile data
      if (serviceProfile?.stripe_customer_id) {
        debugLog.push({ step: "Found existing Stripe customer ID", customerId: serviceProfile.stripe_customer_id })
        return { success: true, customerId: serviceProfile.stripe_customer_id }
      }
    } else if (regularProfile?.stripe_customer_id) {
      debugLog.push({
        step: "Found existing Stripe customer ID via regular client",
        customerId: regularProfile.stripe_customer_id,
      })
      return { success: true, customerId: regularProfile.stripe_customer_id }
    }

    // Create new Stripe customer
    debugLog.push({ step: "Creating new Stripe customer" })
    const customerResult = await createCustomer(
      user.email!,
      user.user_metadata?.full_name || user.user_metadata?.name || user.email,
    )

    debugLog.push({ step: "Stripe customer creation result", customerResult })

    if (!customerResult.success) {
      console.error("Debug log:", debugLog)
      return { ...customerResult, debug: { debugLog } }
    }

    // Save customer ID to profile (use service client to ensure it works)
    debugLog.push({ step: "Saving Stripe customer ID to profile" })
    const serviceClient = createClient(true)
    const { error: updateError } = await serviceClient
      .from("profiles")
      .update({ stripe_customer_id: customerResult.customerId })
      .eq("id", user.id)

    debugLog.push({
      step: "Profile update result",
      success: !updateError,
      error: updateError
        ? {
            message: updateError.message,
            code: updateError.code,
            details: updateError.details,
            hint: updateError.hint,
          }
        : null,
    })

    if (updateError) {
      console.error("Debug log:", debugLog)
      return {
        success: false,
        error: "Failed to save customer information",
        debug: { debugLog, updateError },
      }
    }

    debugLog.push({ step: "Successfully completed", customerId: customerResult.customerId })
    return { success: true, customerId: customerResult.customerId }
  } catch (error: any) {
    debugLog.push({ step: "Caught exception", error: error.message, stack: error.stack })
    console.error("Debug log:", debugLog)
    return {
      success: false,
      error: "An unexpected error occurred",
      debug: { debugLog, exception: error },
    }
  }
}
