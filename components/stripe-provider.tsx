"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import type { ReactNode } from "react"

// Make sure to call loadStripe outside of a component's render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeProviderProps {
  children: ReactNode
  clientSecret: string
  appearance?: {
    theme?: "stripe" | "night" | "flat"
    variables?: Record<string, string>
  }
}

export function StripeProvider({ children, clientSecret, appearance }: StripeProviderProps) {
  const options = {
    clientSecret,
    appearance: appearance || {
      theme: "stripe",
      variables: {
        colorPrimary: "#6d28d9",
        colorBackground: appearance?.theme === "night" ? "#1e293b" : "#ffffff",
        colorText: appearance?.theme === "night" ? "#f8fafc" : "#1a202c",
        colorDanger: "#ef4444",
        fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "8px",
      },
    },
    // Enable Link and other automatic payment methods
    paymentMethodCreation: "manual",
    mode: "setup",
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
