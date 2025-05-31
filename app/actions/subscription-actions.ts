"use server"

import { getStripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { SUBSCRIPTION_PLANS } from "@/lib/subscription-plans"

export async function getCurrentSubscription() {
  try {
    const supabase = createClient()
    const { data: userData, error: userError } = await supabase.auth.getUser()

    if (userError || !userData?.user) {
      return null
    }

    // For now, return a mock free subscription
    // You can implement actual subscription checking later
    return {
      planId: "free",
      name: "Free Plan",
      isActive: true,
      currentPeriodEnd: null,
      cancelAtPeriodEnd: false,
    }
  } catch (error) {
    console.error("Error getting current subscription:", error)
    return null
  }
}

export async function createCheckoutSession(planId: string, customerId: string) {
  try {
    const plan = SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]

    if (!plan) {
      return { success: false, error: "Invalid plan selected" }
    }

    if (!plan.stripePriceId) {
      console.error(`Missing Stripe price ID for plan: ${planId}`, plan)
      return { success: false, error: `Configuration error: Missing price ID for ${plan.name}` }
    }

    const stripe = getStripe()

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile/billing?canceled=true`,
      metadata: {
        planId: planId,
        source: "bigbased_billing",
      },
    })

    return { success: true, url: session.url }
  } catch (error: any) {
    console.error("Error creating checkout session:", error)
    return { success: false, error: error.message || "Failed to create checkout session" }
  }
}
