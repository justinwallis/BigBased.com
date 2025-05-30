import Stripe from "stripe"

// Initialize Stripe with the secret key
let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const stripeKey = process.env.STRIPE_SECRET_KEY

    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY is not set")
    }

    stripeInstance = new Stripe(stripeKey, {
      apiVersion: "2023-10-16", // Use the latest API version
      appInfo: {
        name: "Big Based",
        version: "1.0.0",
      },
    })
  }

  return stripeInstance
}

export function getPublishableKey(): string {
  const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  if (!key) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set")
  }
  return key
}

// Export with the expected name for compatibility
export const getStripePublishableKey = getPublishableKey

export function validateStripeKeys(): void {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not set")
  }

  if (!publishableKey) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set")
  }

  // Check that the keys match (both live or both test)
  const secretIsLive = secretKey.startsWith("sk_live_")
  const publishableIsLive = publishableKey.startsWith("pk_live_")

  if (secretIsLive !== publishableIsLive) {
    throw new Error("Stripe keys mismatch: one is live and one is test")
  }
}
