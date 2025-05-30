"use client"

import type React from "react"

import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { useTheme } from "next-themes"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface StripeProviderProps {
  children: React.ReactNode
  clientSecret: string
  appearance?: {
    theme?: "stripe" | "night" | "flat"
  }
}

export function StripeProvider({ children, clientSecret, appearance }: StripeProviderProps) {
  const { theme } = useTheme()

  const options = {
    clientSecret,
    appearance: {
      theme: appearance?.theme || (theme === "dark" ? "night" : "stripe"),
      variables: {
        colorPrimary: theme === "dark" ? "#ffffff" : "#000000",
        colorBackground: theme === "dark" ? "#1f2937" : "#ffffff",
        colorText: theme === "dark" ? "#ffffff" : "#000000",
        colorDanger: "#df1b41",
        fontFamily: "Inter, system-ui, sans-serif",
        spacingUnit: "4px",
        borderRadius: "6px",
      },
    },
    // Add currency for Elements that require it
    currency: "usd",
    // Specify the mode for setup intents
    mode: "setup" as const,
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
