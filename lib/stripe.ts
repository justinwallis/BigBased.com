import Stripe from "stripe"

// Only initialize Stripe on the server side
let stripe: Stripe | null = null

export const getStripe = () => {
  if (typeof window !== "undefined") {
    throw new Error("Stripe should only be used on the server side")
  }

  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }

    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-06-20",
      typescript: true,
    })
  }

  return stripe
}

export const getStripePublishableKey = () => {
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set")
  }
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
}

// Validate that we're using the correct environment keys
export const validateStripeKeys = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  const secretKey = process.env.STRIPE_SECRET_KEY

  if (!publishableKey || !secretKey) {
    throw new Error("Stripe keys are not configured")
  }

  // Check if keys match environment (both should be live or both should be test)
  const isPublishableLive = publishableKey.startsWith("pk_live_")
  const isSecretLive = secretKey.startsWith("sk_live_")

  if (isPublishableLive !== isSecretLive) {
    throw new Error("Stripe key environment mismatch - publishable and secret keys must both be live or test")
  }

  return { isLive: isPublishableLive }
}
