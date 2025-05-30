"use client"

import type React from "react"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { getStripePublishableKey } from "@/lib/stripe"

const stripePromise = loadStripe(getStripePublishableKey())

interface StripeProviderProps {
  children: React.ReactNode
  clientSecret?: string
}

export function StripeProvider({ children, clientSecret }: StripeProviderProps) {
  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe" as const,
        },
      }
    : undefined

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  )
}
