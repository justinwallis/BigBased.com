"use server"

import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { getOrCreateStripeCustomer } from "./stripe-actions"
import { SUBSCRIPTION_PLANS, type PlanId } from "@/lib/subscription-plans"

export async function getCurrentSubscription() {
  try {
    const supabase = createClient(false)
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return { success: false, error: "Authentication required" }
    }

    // Get user profile with subscription info
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userData.user.id)
      .single()

    if (profileError) {
      return { success: false, error: "Profile not found" }
    }

    const socialLinks = profile.social_links || {}
    const stripeCustomerId = socialLinks.stripe_customer_id
    const subscriptionStatus = socialLinks.subscription_status
    const subscriptionPlan = socialLinks.subscription_plan || "free"
    const subscriptionPeriodEnd = socialLinks.subscription_period_end
    const cancelAtPeriodEnd = socialLinks.subscription_cancel_at_period_end || false

    // If we have subscription info in the database, use it
    if (subscriptionStatus && subscriptionPlan !== "free") {
      const currentPlan = SUBSCRIPTION_PLANS[subscriptionPlan as PlanId] || SUBSCRIPTION_PLANS.free

      return {
        success: true,
        subscription: {
          status: subscriptionStatus,
          cancel_at_period_end: cancelAtPeriodEnd,
          current_period_end: subscriptionPeriodEnd ? new Date(subscriptionPeriodEnd).getTime() / 1000 : null,
        },
        currentPlan,
        isActive: subscriptionStatus === "active",
        cancelAtPeriodEnd,
        currentPeriodEnd: subscriptionPeriodEnd ? new Date(subscriptionPeriodEnd) : null,
      }
    }

    if (!stripeCustomerId) {
      // User has no Stripe customer, so they're on free plan
      return {
        success: true,
        subscription: null,
        currentPlan: SUBSCRIPTION_PLANS.free,
        isActive: false,
      }
    }

    // Fallback: Get active subscriptions from Stripe
    const stripe = getStripe()
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      limit: 10,
    })

    if (subscriptions.data.length === 0) {
      return {
        success: true,
        subscription: null,
        currentPlan: SUBSCRIPTION_PLANS.free,
        isActive: false,
      }
    }

    // Get the most recent active subscription
    const subscription = subscriptions.data[0]
    const priceId = subscription.items.data[0]?.price.id

    // Find matching plan
    let currentPlan = SUBSCRIPTION_PLANS.free
    for (const [planId, plan] of Object.entries(SUBSCRIPTION_PLANS)) {
      if (plan.stripePriceId === priceId) {
        currentPlan = plan
        break
      }
    }

    return {
      success: true,
      subscription,
      currentPlan,
      isActive: subscription.status === "active",
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    }
  } catch (error: any) {
    console.error("Error getting current subscription:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function createCheckoutSession(priceId: string, planId: PlanId) {
  try {
    const customerResult = await getOrCreateStripeCustomer()
    if (!customerResult.success) {
      return { success: false, error: customerResult.error }
    }

    const stripe = getStripe()
    const session = await stripe.checkout.sessions.create({
      customer: customerResult.customerId,
      payment_method_types: ["card", "link"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/billing?session_id={CHECKOUT_SESSION_ID}&upgrade=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/billing/upgrade?canceled=true`,
      metadata: {
        plan_id: planId,
        source: "bigbased_upgrade",
      },
      subscription_data: {
        metadata: {
          plan_id: planId,
          source: "bigbased_upgrade",
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    })

    return { success: true, sessionUrl: session.url }
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: "Failed to create checkout session" }
  }
}

export async function cancelSubscription(subscriptionId: string, cancelImmediately = false) {
  try {
    const stripe = getStripe()

    if (cancelImmediately) {
      // Cancel immediately
      await stripe.subscriptions.cancel(subscriptionId)
    } else {
      // Cancel at period end
      await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      })
    }

    return { success: true }
  } catch (error: any) {
    console.error("Error canceling subscription:", error)
    return { success: false, error: "Failed to cancel subscription" }
  }
}

export async function reactivateSubscription(subscriptionId: string) {
  try {
    const stripe = getStripe()
    await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: false,
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error reactivating subscription:", error)
    return { success: false, error: "Failed to reactivate subscription" }
  }
}

export async function updateSubscription(subscriptionId: string, newPriceId: string, planId: PlanId) {
  try {
    const stripe = getStripe()

    // Get current subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    // Update the subscription
    await stripe.subscriptions.update(subscriptionId, {
      items: [
        {
          id: subscription.items.data[0].id,
          price: newPriceId,
        },
      ],
      metadata: {
        plan_id: planId,
        source: "bigbased_upgrade",
      },
      proration_behavior: "create_prorations",
    })

    return { success: true }
  } catch (error: any) {
    console.error("Error updating subscription:", error)
    return { success: false, error: "Failed to update subscription" }
  }
}
