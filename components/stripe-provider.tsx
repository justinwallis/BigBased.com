"use client"

import type React from "react"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { getStripePublishableKey } from "@/lib/stripe"

let stripePromise: Promise<any> | null = null

export function getStripeJs() {
  if (!stripePromise) {
    stripePromise = loadStripe(getStripePublishableKey())
  }
  return stripePromise
}

interface StripeProviderProps {
  children: React.ReactNode
  clientSecret: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  return (
    <Elements
      stripe={getStripeJs()}
      options={{
        clientSecret,
        appearance: {
          theme: "night",
          variables: {
            colorPrimary: "#6d28d9",
            colorBackground: "#1e293b",
            colorText: "#f8fafc",
            colorDanger: "#ef4444",
            fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "8px",
          },
        },
      }}
    >
      {children}
    </Elements>
  )
}
